import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.multipdf.LayerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.PDPageContentStream.AppendMode;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDTrueTypeFont;
import org.apache.pdfbox.pdmodel.font.encoding.StandardEncoding;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.color.PDColorSpace;
import org.apache.pdfbox.pdmodel.graphics.color.PDSeparation;
import org.apache.pdfbox.pdmodel.graphics.form.PDFormXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.interactive.action.PDActionJavaScript;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.util.Matrix;

class PDFBoxExample {


	public static void main(String[] arguments) {

		// change num
		int num = 17;

		switch (num) {
		//-------------------
		//Day 5 20020507
		//-------------------
		case 1:
			// Exercise 1
			createBlankDocument();
			break;
		case 2:
			// LoadDocument
			loadPDFDocument();
			break;
		case 3:
			// Exercise 2
			createDocumentText();
			break;
		case 4:
			// Exercise 3
			createDocumentwithVector();
			break;
		case 5:
			// Exercise 4
			createDocumentwithImage();
			break;
		//-------------------
		//Day 6 20020527
		//-------------------
		case 6:
			// Exercise 1
			createImposedDocument();
			break;
		case 7:
			// Exercise 1 8slot (homework)
			createImposedDocumentEx1();
			break;
		//-------------------
		//Day 6 20020528
		//-------------------
		case 8:
			// Exercise 2
			rasterizeDocument();
			break;
		case 9:
			// Exercise 2
			rasterizeDocumentEx1();
			break;
		case 10:
			// Exercise 3
			extractOutlines();
			break;
		//-------------------
		//Day 7 20200618
		//-------------------
		case 11:
			// Exercise 1
			suppressGlossInk();
			break;
		// Cut Outline
		case 12:
			// Exercise
			extractOutlinesCut();
			break;

		//-------------------
		//Day X testPDF
		//-------------------
		case 13:
			// Exercise
			createPDFwithImage();
			break;

		//-------------------
		//Day 10 20201126, 20201130
		//-------------------
		case 14:
			createAnnotations();
			break;

		case 15:
			addOpenAction();
			break;

		case 16:
			encryptDocument();
			break;

		case 17:
			rotatePages();
            break;

		}

	}




	static String userPass = "C:\\Users\\itatsuya\\work\\tmp\\Event\\PDF_Training\\pdfbox\\";
	static String COLORANT_NAME_GROSS = "RDG_GLOSS";
	static String COLORANT_NAME_PRIMER = "RDG_PRIMER";
	static String COLORANT_NAME_None = "None";
	//static String COLORANT_NAME_CUt ="CutContour";
	private static List<PDSeparation> glossColorSpaces = null;
	private static List<PDSeparation> primerColorSpaces = null;


	private static void rotatePages() {
		PDDocument loadPDF1 = null;
		String inputpdf = "Rotate\\lorem.pdf";
		String outputFileName = "lorem-rotated.pdf";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + inputpdf));

			int numPages = loadPDF1.getNumberOfPages();
			for (int i = 0; i < numPages; i++) {
				PDPage page = loadPDF1.getPage(0);
			    page.setRotation(90);

				page = loadPDF1.getPage(1);
			    page.setRotation(180);

				page = loadPDF1.getPage(2);
			    page.setRotation(270);

			}

			loadPDF1.save(new FileOutputStream(userPass + outputFileName));

			System.out.println("createAnnotations Document saved successfully !");

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {

			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}



	private static void encryptDocument() {

		PDDocument loadPDF1 = null;
		String inputpdf = "Encrypt\\lorem.pdf";
		String outputFileName = "lorem-encrypt.pdf";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + inputpdf));

			AccessPermission ap = new AccessPermission();
			ap.setCanPrint(false);
			ap.setCanExtractContent(false);

			//StandardProtectionPolicy(String ownerPassword, String userPassword, AccessPermission permissions)
			StandardProtectionPolicy spp = new StandardProtectionPolicy("RDG", "tatsuya", ap);
			spp.setEncryptionKeyLength(128);
			spp.setPreferAES(true);

			loadPDF1.protect(spp);

			loadPDF1.save(new FileOutputStream(userPass + outputFileName));

			System.out.println("createAnnotations Document saved successfully !");

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {

			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	private static void addOpenAction() {
		PDDocument loadPDF1 = null;
		String inputpdf = "Action\\lorem.pdf";
		String outputFileName = "lorem-action.pdf";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + inputpdf));

			PDActionJavaScript action = new PDActionJavaScript();
			action.setAction("app.alert(\"Hello, World !!\", 3)");

			PDDocumentCatalog catalog = loadPDF1.getDocumentCatalog();
			catalog.setOpenAction(action);

			loadPDF1.save(new FileOutputStream(userPass + outputFileName));

			System.out.println("createAnnotations Document saved successfully !");

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {

			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	private static void createAnnotations() {
		PDDocument loadPDF1 = null;
		String inputpdf = "Annots\\lorem.pdf";
		String outputFileName = "lorem-annotations2.pdf";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + inputpdf));
			PDPage page = loadPDF1.getPage(0);
			Annotation.addTextAnnotation(page);

			// Add stamp on the second page.
			page = loadPDF1.getPage(1);
			Annotation.addStampAnnotation(page);

			// Add text highlight on the third page.
			page = loadPDF1.getPage(2);
			Annotation.addTextHighlight(page);

			loadPDF1.save(new FileOutputStream(userPass + outputFileName));

			System.out.println("createAnnotations Document saved successfully !");

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {

			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}


	private static void createPDFwithImage() {
		PDDocument document = null;
		String loadFile = "C:\\Users\\itatsuya\\Desktop\\product_design.png";

		try {
		    document = new PDDocument();

		    PDPage page = new PDPage();

		    // 1.  size
		    PDRectangle a = new PDRectangle();
		    a.setLowerLeftX(0);
		    a.setLowerLeftY(0);
		    a.setUpperRightX(1000);
		    a.setUpperRightY(1000);
		    //page.setMediaBox(PDRectangle.A4);
		    page.setMediaBox(a);
		    PDPageContentStream content = new PDPageContentStream(document, page);

		    // 2 Add image
			PDImageXObject image = PDImageXObject.createFromFile(loadFile, document);
			//content.drawImage(image, 100, 100, 300, 500);
			image.getWidth();

			Matrix imageMatrix = new Matrix(200, 0, 0, 500, 100, 100);
			content.drawImage(image,imageMatrix);
			content.drawImage(image,0,0);

		    content.fill();

		    content.close();


		    document.addPage(page);
			document.save("C:\\Users\\itatsuya\\Desktop\\" + "TestTest.pdf");

			System.out.println("Document saved successfully: createDocumentwithImage");

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}


	private static void extractOutlinesCut() {
		PDDocument document = null;
		PDDocument loadPDF1 = null;
		String orderPDF1 = "Cut\\Cut.pdf";
		String outputFileName = "cutline.txt";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + orderPDF1));
			PDPage page = loadPDF1.getPage(0);

			OutlineGenerator outGenerator = new OutlineGenerator(page);
			String outlines = outGenerator.getOutlines();

			FileOutputStream outputFile = new FileOutputStream(userPass + outputFileName);
			outputFile.write(outlines.getBytes());
			outputFile.close();


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private static void suppressGlossInk() {
		PDDocument loadPDF1 = null;
		String specialcolorPDF1 = "Color\\PrCMYKGl.pdf";
		String outputFileName = "Color\\AfterColor\\AfterColorPrCMYKGl.pdf";
		glossColorSpaces = new ArrayList<PDSeparation>();
		primerColorSpaces = new ArrayList<PDSeparation>();

		try {
			loadPDF1 = PDDocument.load(new File(userPass + specialcolorPDF1));
			PDPage page = loadPDF1.getPage(0);

			// Collect all RDG_GLOSS colorspaces.
			// Add "glossColorSpaces"
			collectResources(page.getResources());
			System.out.println("Collected: " + glossColorSpaces.size());

			for(PDSeparation colorSpace : glossColorSpaces) {
				colorSpace.setColorantName(COLORANT_NAME_None);
			}

			for(PDSeparation colorSpace : primerColorSpaces) {
				colorSpace.setColorantName(COLORANT_NAME_GROSS);
			}

			// create newFile
			loadPDF1.save(new File(userPass + outputFileName));
			// OR
//			FileOutputStream outputFile = new FileOutputStream(userPass + outputFileName);
//			outputFile.close();


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
	    } finally {
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}


	private static void collectResources(PDResources resources) throws IOException {
		for (COSName name : resources.getColorSpaceNames()) {
			PDColorSpace colorSpace = resources.getColorSpace(name);

			if (colorSpace instanceof PDSeparation) {
				PDSeparation separationColorSpace = (PDSeparation) colorSpace;
				String colorantName = separationColorSpace.getColorantName();

				System.out.println("colorant:" + colorantName);
				if(colorantName.equals(COLORANT_NAME_GROSS)) {
					glossColorSpaces.add(separationColorSpace);
				}
				else if(colorantName.equals(COLORANT_NAME_PRIMER)) {
					primerColorSpaces.add(separationColorSpace);
				}

			}

		}

		// Page Resource の下のForm ResourceにColor Spaceがあるとき
		// XOjectを呼んでPDXObjectからPDResourceのcolorを取得する
		for (COSName name : resources.getXObjectNames()) {
			PDXObject xObject = resources.getXObject(name);
			if(xObject instanceof PDFormXObject) {
				PDFormXObject formXObject = (PDFormXObject)xObject;
				collectResources(formXObject.getResources());
			}
		}
	}


	private static void extractOutlines() {
		PDDocument document = null;
		PDDocument loadPDF1 = null;
		String orderPDF1 = "OrderPDFs\\mario_80x80.pdf";
		String outputFileName = "marioAA.txt";

		try {
			loadPDF1 = PDDocument.load(new File(userPass + orderPDF1));
			PDPage page = loadPDF1.getPage(0);

			OutlineGenerator outGenerator = new OutlineGenerator(page);
			String outlines = outGenerator.getOutlines();

			FileOutputStream outputFile = new FileOutputStream(userPass + outputFileName);
			outputFile.write(outlines.getBytes());
			outputFile.close();


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
	    } finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}


	}

	private static void rasterizeDocumentEx1() {
		PDDocument document = null;
		PDDocument loadPDF1 = null;
		String orderPDF1 = "OrderPDFs\\mario_80x80.pdf";
		float dpi = 353.0f;
		String outputFileName = "marioAA.raw";
		ImageType imgType = ImageType.GRAY;

		try {
			loadPDF1 = PDDocument.load(new File(userPass + orderPDF1));

			PDFRenderer renderer = new PDFRenderer(loadPDF1);
			BufferedImage image = renderer.renderImageWithDPI(0, dpi, imgType);
			DataBufferByte byteBuffer = (DataBufferByte)image.getData().getDataBuffer();

			FileOutputStream outputFile = new FileOutputStream(userPass + outputFileName);
			outputFile.write(byteBuffer.getData());
			outputFile.close();


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
	    } finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private static void rasterizeDocument() {
		PDDocument document = null;
		PDDocument loadPDF1 = null;
		String orderPDF1 = "OrderPDFs\\sunflowers_100x200.pdf";
		float dpi = 300.0f;
		String formatName = "JPG";
		String outputFileName = "sunflowersAA.jpg";
		ImageType imgType = ImageType.RGB;

		try {
			loadPDF1 = PDDocument.load(new File(userPass + orderPDF1));

			PDFRenderer renderer = new PDFRenderer(loadPDF1);
			BufferedImage image = renderer.renderImageWithDPI(0, dpi, imgType);

			File outputFile = new File(userPass + outputFileName);
			ImageIO.write(image, formatName, outputFile);


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
	    } finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	private static void createImposedDocumentEx1() {

		PDDocument document = null;
		PDDocument loadPDF1 = null;
		PDDocument loadPDF2 = null;
        float zero = 0.0f;
        float margin = 20.0f;
        float spacing = 20.0f;
        float slotX = 100.0f;
        float slotY = 200.0f;
        int slotNumX = 4;
        int slotNumY = 2;
        String orderPDF1 = "OrderPDFs\\sunflowers_100x200.pdf";
        String orderPDF2 = "OrderPDFs\\stars_100x200.pdf";

	    try {
			document = new PDDocument();
			PDPage page = new PDPage();

			// Set MediaBox size into PDPage
			setMediaBox(page, zero, slotX, slotY, margin, spacing, slotNumX, slotNumY);

			//------------------------------------------------
			// Imposition logic
			// ・load PDF
			// ・define PDFormXObject (use LayerUtility and import Load PDF)
			// ・draw PDFormXObject to PDPageContentStream
			//------------------------------------------------
			// Load Source PDF sunflowers_100x200.pdfa
			loadPDF1 = PDDocument.load(new File(userPass + orderPDF1));
			loadPDF2 = PDDocument.load(new File(userPass + orderPDF2));

			// Get the contents of the Order PDF. Add to the imposed PDF contents.
			// LoadPDocument and set PDFormXObject
			PDFormXObject form1 = setLayerUtility(document, loadPDF1);
			PDFormXObject form2 = setLayerUtility(document, loadPDF2);

			// Content Stream
			// PDPageContentStream(PDDocument document, PDPage sourcePage, PDPageContentStream.AppendMode appendContent, boolean compress)
			PDPageContentStream contents = new PDPageContentStream(document, page, AppendMode.OVERWRITE, false);
			int slotNum;
			float[] slotParameter = new float[] { margin, spacing, slotX, slotY, slotNumX, slotNumY};
			setMatrix(slotNum = 4, slotParameter, form1, contents);
			setMatrix(slotNum = 3, slotParameter, form1, contents);
			setMatrix(slotNum = 2, slotParameter, form1, contents);
			setMatrix(slotNum = 1, slotParameter, form1, contents);
			setMatrix(slotNum = 7, slotParameter, form2, contents);
			setMatrix(slotNum = 6, slotParameter, form2, contents);
			setMatrix(slotNum = 5, slotParameter, form1, contents);

		    contents.close();
		    document.addPage(page);
			document.save(userPass+"ex5-1.pdf");

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF1 != null) {
				try {
					loadPDF1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(loadPDF2 != null) {
				try {
					loadPDF2.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}



	private static PDFormXObject setLayerUtility(PDDocument loadPDF1, PDDocument loadPDF2) throws IOException {
		LayerUtility layerUtility = new LayerUtility(loadPDF1);
		PDFormXObject form = layerUtility.importPageAsForm(loadPDF2, 0);
		return form;
	}

	private static void setMatrix(int slotNum, float[] slotParameter, PDFormXObject form, PDPageContentStream contents) throws IOException {
		// slotParameter = float[] { margin, spacing, slotX, slotY, slotNumX, slotNumY }
		//                            [20.0,  20.0,   100.0,  200.0,  4.0,    2.0]
		//  X : (| slotNum % slotNumX - slotNumX |) % slotNumX * (slotX+spacing) + margin
	    //  Y : floor(  slotNum / slotNumY + slotNumY )        * (slotY+spacing) + margin
		float slotX1 = Math.abs((slotNum % slotParameter[4]) - slotParameter[4]) % slotParameter[4];
		float slotX2 = slotX1 * (slotParameter[2] + slotParameter[1]) + slotParameter[0];
		float slotY1 = (float) Math.floor(slotNum / (slotParameter[4] + 1));
		float slotY2 = slotY1 * (slotParameter[3] + slotParameter[1]) + slotParameter[0];

		Matrix matrix = new Matrix();
		contents.saveGraphicsState();
		matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f,	mmToPoints(slotX2), mmToPoints(slotY2));
		contents.transform(matrix);
		contents.drawForm(form);  //
		contents.restoreGraphicsState();

	}

	private static void setMediaBox(PDPage page, float zero, float slotX, float slotY, float margin,
			float spacing, int slotNumX, int slotNumY) {
		PDRectangle mediaBox = new PDRectangle();
		mediaBox.setLowerLeftX(zero);
		mediaBox.setLowerLeftY(zero);;
		mediaBox.setUpperRightX(mmToPoints((slotX + margin) * slotNumX + spacing));
		mediaBox.setUpperRightY(mmToPoints((slotY + margin) * slotNumY + spacing));
		page.setMediaBox(mediaBox);
	}

	private static void createImposedDocument() {
		PDDocument document = null;
        PDDocument loadPDF = null;
        String loadFileName = "OrderPDFs\\sunflowers_100x200.pdf";

	    try {
			document = new PDDocument();
			PDPage page = new PDPage();


			// set MediaBox size
			PDRectangle mediaBox = new PDRectangle();
			mediaBox.setLowerLeftX(0.0f);
			mediaBox.setLowerLeftY(0.0f);;
			mediaBox.setUpperRightX(mmToPoints(230));
			mediaBox.setUpperRightY(mmToPoints(220));
			page.setMediaBox(mediaBox);

			//------------------------------------------------
			// Imposition logic
			// ・load PDF
			// ・define PDFormXObject (use LayerUtility and import Load PDF)
			// ・draw PDFormXObject to PDPageContentStream
			//------------------------------------------------
			// Load Source PDF sunflowers_100x200.pdf
			loadPDF = PDDocument.load(new File(userPass + loadFileName));

			// Content Stream
			// PDPageContentStream(PDDocument document, PDPage sourcePage, PDPageContentStream.AppendMode appendContent, boolean compress)
			PDPageContentStream contents = new PDPageContentStream(document, page, AppendMode.OVERWRITE, false);

			// Get the contents of the Order PDF. Add to the imposed PDF contents.
			LayerUtility layerUtility = new LayerUtility(document);
			PDFormXObject form = layerUtility.importPageAsForm(loadPDF, 0);


			Matrix matrix = new Matrix();
			// apply to transform Matix1
			contents.saveGraphicsState(); // q Q -gsave grestore
			matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f, mmToPoints(10.0f), mmToPoints(10.0f));
			contents.transform(matrix);
			contents.drawForm(form);  //
			contents.restoreGraphicsState(); // q Q -gsave grestore : this is stack structure

			// apply to transform Matix2
			contents.saveGraphicsState();
			matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f, mmToPoints(120.0f), mmToPoints(10.0f));
			contents.transform(matrix);
			contents.drawForm(form);
			contents.restoreGraphicsState();


		    contents.close();
		    document.addPage(page);
			document.save(userPass+"ex5.pdf");


		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if(loadPDF != null) {
				try {
					loadPDF.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}


	}

	private static void createDocumentwithImage() {
		PDDocument document = null;
		String loadFile = "Nature\\sunflowers.jpg";

		try {
		    document = new PDDocument();

		    PDPage page = new PDPage();

		    // 1. Letter size
		    page.setMediaBox(PDRectangle.LETTER);
		    PDPageContentStream content = new PDPageContentStream(document, page);

		    // 2 Add image
			PDImageXObject image = PDImageXObject.createFromFile(userPass + loadFile, document);
			//content.drawImage(image, 100, 100, 300, 500);
			image.getWidth();

			Matrix imageMatrix = new Matrix(200, 0, 0, 500, 100, 100);
			content.drawImage(image, imageMatrix);

		    content.fill();

		    content.close();


		    document.addPage(page);
			document.save(userPass + "ex4.pdf");

			System.out.println("Document saved successfully: createDocumentwithImage");

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}

	private static void createDocumentwithVector() {
		PDDocument document = null;

		try {
		    document = new PDDocument();

		    PDPage page = new PDPage();

		    // 1 Letter size
		    page.setMediaBox(PDRectangle.LETTER);
		    PDPageContentStream content = new PDPageContentStream(document, page);


		    // 2 Add vectors
		    // 2.1 add rectangle
		    content.setNonStrokingColor(1.0f, 1.0f, 0.0f);// yellow (default is black)
		    content.addRect(200, 250, 300, 200);
		    content.fill();

		    // 2.2 add triangle
		    content.setNonStrokingColor(1.0f, 0.5f, 0.0f);// oragne fill
		    content.setStrokingColor(0.0f, 0.0f, 1.0f);// blue stroke
		    content.moveTo(300, 400);
			content.lineTo(500,  400);
			content.lineTo(400,  550);
			content.closePath();
			content.setLineWidth(10);
			content.fillAndStroke();

		    content.setStrokingColor(1.0f, 1.0f, 1.0f);// stroke
		    content.moveTo(300, 400);
			content.lineTo(500,  400);
			content.lineTo(400,  550);
			content.closePath();
			content.setLineWidth(1);
			content.stroke();

			//2.3 add arlc
			float kMagic = 0.55228475f;
			// p0 = [0, radius]
			// p1 = [radius * K, radius]
			// p2 = [radius, radius * K]
			// p3 = [radius, 0]
			float radius = 100.0f;
			float k = 0.55f;
			content.moveTo(0, 0);
			content.lineTo(0,  radius);
			content.curveTo(radius * k, radius,
					radius, radius * k,
					radius, 0);
			content.closePath();
			content.setNonStrokingColor(0.0f, 1.0f, 0.0f, 0.0f);
			Matrix translateMatrix = new Matrix(1, 0, 0, 1, 200, 600);
			content.transform(translateMatrix);
			content.fill();


		    content.close();


		    document.addPage(page);
			document.save(userPass + "ex3.pdf");

			System.out.println("Document saved successfully: createDocumentwithVector");

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}

	private static void createDocumentText() {
		PDDocument document = null;
		String loadFile = "font\\lobster-two-v11-latin-regular.ttf";

		try {
		    document = new PDDocument();

		    PDPage page = new PDPage();

		    // 1. Letter size
		    page.setMediaBox(PDRectangle.LETTER);
		    PDPageContentStream content = new PDPageContentStream(document, page);

		    content.beginText();

		    PDFont font = null;
		    //font  = PDType1Font.HELVETICA;

			File fontFile = new File(userPass + loadFile);
			font = PDTrueTypeFont.load(document, fontFile, StandardEncoding.INSTANCE);

		    content.newLineAtOffset(100, 350);

		    content.setFont(font, 44);
		    content.showText("Hello, world !");
		    content.endText();

		    content.close();

		    document.addPage(page);
			document.save(userPass + "ex2.pdf");

			System.out.println("Document saved successfully:createDocumentText");

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if(document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}

	private static void createBlankDocument() {

		PDDocument document = null;

		try {
			document = new PDDocument();

			//PDPage page = new PDPage();

			// 1. Letter
			//page.setMediaBox(PDRectangle.LETTER);
			/*
			// 2. Custom
			PDRectangle rect = new PDRectangle();
			rect.setLowerLeftX(0);
			rect.setLowerLeftY(0);
			rect.setUpperRightX(100); // in PDF points 1point = 1/72 of an inch
			rect.setUpperRightY(150);
			page.setMediaBox(rect);
			*/

			for (int i = 0; i < 5; i++) {
				PDPage page = new PDPage();

				if (i > 2) {
					PDRectangle rect = new PDRectangle();
					rect.setLowerLeftX(0);
					rect.setLowerLeftY(0);
					rect.setUpperRightX(100); // in PDF points 1point = 1/72 of an inch
					rect.setUpperRightY(150);
					page.setMediaBox(rect);
				} else {
					page.setMediaBox(PDRectangle.A4);
				}
				document.addPage(page);

			}

			document.save(userPass + "ex1.pdf");
			System.out.println("Document saved successfully");

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}

	private static void loadPDFDocument() {

		PDDocument document = null;

		try {

			File file = new File(userPass + "ex1.pdf");
			document = PDDocument.load(file);

			PDPage page = document.getPage(0);
			PDRectangle rect = page.getMediaBox();

			//document.save("C:\\Users\\itatsuya\\Desktop\\pdfbox\\ex2.pdf");
			System.out.println("Document saved successfully:" + document.getNumberOfPages());
			System.out.println("Document saved successfully:" + rect);

		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
			System.out.println("Faild to save ducument. " + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch (IOException e) {
					// TODO 自動生成された catch ブロック
					e.printStackTrace();
				}
			}
		}

	}

	private static float mmToPoints(float mm) {
		float inches = mm / 25.4f;
		return inches * 72.0f;
	}
}

