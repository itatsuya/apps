using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Drawing;
using Svg;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using System.Xml;

namespace SVGParser
{
    class SVGParser
    {
        //
        //
        //
        // Use PDCustomizationTool project code
        //
        //
        //
        private String fillColor = null;
        private String strokeColor = null;
        private Dictionary<String, SvgElement> svgDefinitionList = null;

        private static Type[] kColorableElementTypes = new Type[] {
            typeof(SvgPath),
            typeof(SvgLine),
            typeof(SvgText),
            typeof(SvgRectangle),
            typeof(SvgCircle),
            typeof(SvgEllipse),
            typeof(SvgPolygon),
            typeof(SvgPolyline)
        };

        private bool IsColorableElement(Type type)
        {
            return kColorableElementTypes.Contains(type);
        }

        private String GetElementColor(SvgPaintServer paintServer)
        {
            if (paintServer == null)
                return String.Empty; // No color

            String color = null;
            if (paintServer is SvgColourServer)
            {
                Color fill = (paintServer as SvgColourServer).Colour;
                color = ColorTranslator.ToHtml(fill);
            }

            return color;
        }

        private bool IsSingleColor(SvgElementCollection elements)
        {
            bool result = true;

            // Iterate over all SVG elements, comparing the fill and stroke colors.
            foreach (SvgElement element in elements)
            {
                Type type = element.GetType();

                if (type == typeof(SvgGroup))
                {
                    bool isGroupSingleColor = IsSingleColor(element.Children);
                    if (!isGroupSingleColor)
                    {
                        result = false;
                        break;
                    }
                }
                else if (IsColorableElement(type))
                {
                    String elementFillColor = GetElementColor(element.Fill);
                    String elementStrokeColor = GetElementColor(element.Stroke);

                    if (elementFillColor == null || elementStrokeColor == null)
                    {
                        result = false;
                        break;
                    }

                    if (fillColor == null || strokeColor == null)
                    {
                        // First time through.
                        fillColor = elementFillColor;
                        strokeColor = elementStrokeColor;
                    }
                    else if (!elementFillColor.Equals(fillColor) || !elementStrokeColor.Equals(strokeColor))
                    {
                        result = false;
                        break;
                    }
                }
                else if (type == typeof(SvgImage))
                {
                    // Images - Not unicolor.
                    result = false;
                    break;
                }
                else if (type == typeof(SvgDefinitionList))
                {
                    SvgDefinitionList definitions = (SvgDefinitionList)element;
                    foreach (SvgElement definition in definitions.Children)
                    {
                        if (!String.IsNullOrEmpty(definition.ID))
                        {
                            // Store the definition.
                            svgDefinitionList.Add(definition.ID, definition);
                        }
                    }
                }
                else if (type == typeof(SvgUse))
                {
                    SvgUse svgUse = (SvgUse)element;
                    String referenceID = svgUse.ReferencedElement.ToString().Substring(1); // Get the referenced element ID ripping off the #

                    if (svgDefinitionList.ContainsKey(referenceID))
                    {
                        SvgElement referencedElement = svgDefinitionList[referenceID];
                        String referencedElementFillColor = GetElementColor(referencedElement.Fill);

                        // The referenced element is a child of definition list element, but it is rendered in the
                        // context of the use element. Therefore, we need to propagate the use element's fill and stroke
                        // color to the referenced element, in case it does not define fill or stroke color of its own.
                        // We later restore the refereced element's fill and stroke color to original state.
                        SvgPaintServer origFillColorServer = referencedElement.Fill;
                        SvgPaintServer origStrokeColorServer = referencedElement.Stroke;

                        if (referencedElementFillColor.Equals("Black"))
                        {
                            referencedElement.Fill = svgUse.Fill;
                        }

                        if (referencedElement.Stroke == null)
                        {
                            referencedElement.Stroke = svgUse.Stroke;
                        }

                        bool isElementSameColor = IsSingleColor(referencedElement.Children);

                        // Restore the fill and stroke colors.
                        referencedElement.Fill = origFillColorServer;
                        referencedElement.Stroke = origStrokeColorServer;

                        if (!isElementSameColor)
                        {
                            result = false;
                            break;
                        }
                    }
                }
            }

            return result;
        }

        public bool IsSVGSingleColor(String filePath)
        {
            try
            {
                // Assume the SVG files are located here 
                string addressTemplate = filePath;
                XmlDocument XD = new XmlDocument();

                // Get a stream to it 
                WebRequest request = WebRequest.Create(new Uri(addressTemplate));
                using (WebResponse response = request.GetResponse())
                {
                    Stream stream = response.GetResponseStream();
                    XD.Load(stream);
                }

                SvgDocument document = SvgDocument.Open(XD);
                fillColor = strokeColor = null;
                svgDefinitionList = new Dictionary<string, SvgElement>();

                bool result = IsSingleColor(document.Children);

                return result;
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Error : " + e);
                return false;
            }

        }
    }
}
