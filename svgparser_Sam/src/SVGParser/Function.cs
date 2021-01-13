using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Amazon.Lambda.Core;


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace SVGParser
{
    public class Function
    {


        /// <summary>
        /// A simple function that takes a string and does a ToUpper
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public string FunctionHandler(object input, ILambdaContext context)
        {
            string filepath = @"https://s3-ap-northeast-1.amazonaws.com/com.rolanddg.cotodesign-2/resources/clipart/Shapes/trapeziod.svg";

            if (CheckURLValid(filepath))
            {
                var svgParser = new SVGParser();
                bool isSingleColor = svgParser.IsSVGSingleColor(filepath);
                return isSingleColor ? "uniColor" : "nonUniColor";
            } else {
                return "invalid URL";
            }
            
            //return input?.ToUpper();
        }

        private bool CheckURLValid(string strURL)
        {
            //return Uri.IsWellFormedUriString(strURL, UriKind.RelativeOrAbsolute);
            return true;
        }

    }
}
