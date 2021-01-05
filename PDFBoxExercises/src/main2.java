import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDTrueTypeFont;
import org.apache.pdfbox.pdmodel.font.encoding.StandardEncoding;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.util.Matrix;

class PDFBoxExample {

	static String userPass = "C:\\Users\\itatsuya\\Desktop\\pdfbox\\";

	public static void main (String [] arguments) {
		// Your code goes here.
		createBlankDocument();

		createDocumentWithText();

		createDocumentWithVectors();

		createDocumentWithImages();
	}

	private static void createBlankDocument() {
		PDDocument document = null;
		//PDPage page = new PDPage();
		PDPage page = null;


		try {
			document = new PDDocument();

			page = new PDPage();

			PDRectangle mediaBox = new PDRectangle();
			mediaBox.setLowerLeftX(0);
			mediaBox.setLowerLeftY(0);
			mediaBox.setUpperRightX(100);
			mediaBox.setUpperRightY(100);

			page.setMediaBox(mediaBox);
			//page.setMediaBox(PDRectangle.A4);

			document.addPage(page);

			document.save(userPass + "exercise-1.pdf");

			System.out.println("Document created successfully. :exercise-1.pdf");
		} catch(IOException e) {
			System.out.println("Failed to create document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch(IOException e) {
				}
			}
		}
	}

	private static void createDocumentWithText() {
		PDDocument document = null;
		PDPage page = new PDPage();

		try {
			document = new PDDocument();

			page = new PDPage();
			page.setMediaBox(PDRectangle.LETTER);

			PDPageContentStream contents = new PDPageContentStream(document, page);
			contents.beginText();

			contents.newLineAtOffset(100,  100);
			//contents.setFont(PDType1Font.HELVETICA, 30.0f);

			File fontFile = new File(userPass + "font\\lobster-two-v11-latin-regular.ttf");
			PDFont font = PDTrueTypeFont.load(document, fontFile, StandardEncoding.INSTANCE);
			contents.setFont(font, 40.0f);

			contents.showText("Hello, World");

			contents.endText();
			contents.close();

			document.addPage(page);

			document.save(userPass + "exercise-2.pdf");

			System.out.println("Document created successfully. :exercise-2.pdf ");
		} catch(IOException e) {
			System.out.println("Failed to create document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch(IOException e) {
				}
			}
		}
	}

	private static void createDocumentWithVectors() {
		PDDocument document = null;
		PDPage page = new PDPage();

		try {
			document = new PDDocument();

			page = new PDPage();
			page.setMediaBox(PDRectangle.LETTER);

			PDPageContentStream contents = new PDPageContentStream(document, page);

			contents.setNonStrokingColor(1.0f, 1.0f, 0.0f);
			contents.addRect(100, 100, 300, 200);
			contents.fill();

			contents.moveTo(300,  400);
			contents.lineTo(500,  400);
			contents.lineTo(400,  550);
			contents.closePath();
			contents.setNonStrokingColor(1.0f, 0.5f, 0.0f);
			//contents.fill();

			contents.setStrokingColor(0,  0, 1.0f);
			contents.fillAndStroke();

			float kMagic = 0.55228475f;
			// p0 = [0, radius]
			// p1 = [radius * K, radius]
			// p2 = [radius, radius * K]
			// p3 = [radius, 0]

			Matrix translateMatrix = new Matrix(1, 0, 0, 1, 100, 500);
			contents.transform(translateMatrix);
			contents.moveTo(0, 0);
			contents.lineTo(0,  100);
			contents.curveTo(100 * kMagic, 100, 100, 100 * kMagic, 100, 0);
			contents.closePath();
			contents.setNonStrokingColor(0.0f, 1.0f, 0.0f, 0.0f);
			contents.fill();

			contents.close();

			document.addPage(page);

			document.save(userPass + "exercise-3.pdf");

			System.out.println("Document created successfully. :exercise-3.pdf ");
		} catch(IOException e) {
			System.out.println("Failed to create document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch(IOException e) {
				}
			}
		}
	}

	private static void createDocumentWithImages() {
		PDDocument document = null;
		PDPage page = new PDPage();

		try {
			document = new PDDocument();

			page = new PDPage();
			page.setMediaBox(PDRectangle.LETTER);

			PDPageContentStream contents = new PDPageContentStream(document, page);

			PDImageXObject image = PDImageXObject.createFromFile(userPass + "Nature\\sunflowers.jpg", document);
			contents.drawImage(image, 100, 100, 150, 300);

			//PDImageXObject image = PDImageXObject.createFromFile("C:\\Users\\dell\\Desktop\\Nature\\sunshine.jpg", document);
			//Matrix imageMatrix = new Matrix(200, 0, 0, 200, 250, 250);
			//contents.drawImage(image, imageMatrix);

			contents.close();

			document.addPage(page);

			document.save(userPass + "exercise-4.pdf");

			System.out.println("Document created successfully. :exercise-4.pdf ");
		} catch(IOException e) {
			System.out.println("Failed to create document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch(IOException e) {
				}
			}
		}
	}
}
