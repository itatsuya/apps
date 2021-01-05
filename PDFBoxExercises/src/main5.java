import java.awt.geom.Point2D;
import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceCMYK;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.apache.pdfbox.pdmodel.interactive.action.PDActionJavaScript;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationRubberStamp;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationText;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup;
// Day10 (Web8)
class PDFBoxExample {
	public static void main (String [] arguments) {
		// Create the annotations.
		//createAnnotations();

		// Add a JavaScript action.
		//addAction();

		// Encrypt the document.
		//encryptDocument();

		// Rotate the page.
		//rotatePages();
	}

	private static void createAnnotations() {
		PDDocument srcDoc = null;

		try {
			srcDoc = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\lorem.pdf"));

			// Add text annotation on the first page.
			PDPage page = srcDoc.getPage(0);
			addTextAnnotation(page);

			// Add stamp on the second page.
			page = srcDoc.getPage(1);
			addStampAnnotation(page);

			// Add text highlight on the third page.
			page = srcDoc.getPage(2);
			addTextHighlight(page);

			srcDoc.save(new File("C:\\Users\\dell\\Desktop\\lorem_with_annots.pdf"));

			System.out.println("Document saved successfully !");

		} catch(Exception ex) {
			System.out.println("Failed. " + ex.getMessage());
		} finally {

			if (srcDoc != null) {
				try {
					srcDoc.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void addTextAnnotation(PDPage page) {
		PDAnnotationText annot = new PDAnnotationText();

		// Position at center of page.
		Point2D.Float center = getCenterOfPage(page);

        PDRectangle position = new PDRectangle();
        position.setLowerLeftX((float)center.getX() - 20);
        position.setLowerLeftY((float)center.getY() - 20);
        position.setUpperRightX((float)center.getX() + 20);
        position.setUpperRightY((float)center.getY() + 20);
        annot.setRectangle(position);

        // Set the contents.
		annot.setContents("Hello, World !!");

		// Set color of icon.
		annot.setColor(new PDColor(new float[] {0.0f, 0.0f, 1.0f}, PDDeviceRGB.INSTANCE));

		// Add to page.
		try {
			page.getAnnotations().add(annot);
		} catch (IOException e) {
		}
	}

	private static void addStampAnnotation(PDPage page) {
		PDAnnotationRubberStamp annot = new PDAnnotationRubberStamp();

		// Position at center of page.
		Point2D.Float center = getCenterOfPage(page);

        PDRectangle position = new PDRectangle();
        position.setLowerLeftX((float)center.getX() - 100);
        position.setLowerLeftY((float)center.getY() - 100);
        position.setUpperRightX((float)center.getX() + 100);
        position.setUpperRightY((float)center.getY() + 100);
        annot.setRectangle(position);

        // Set the type.
        annot.setName("SBApproved");

        // Set the contents.
		annot.setContents("RDG Approved");

		// Set color of icon.
		annot.setColor(new PDColor(new float[] {1.0f, 0.0f, 0.0f}, PDDeviceRGB.INSTANCE));

		// Add to page.
		try {
			page.getAnnotations().add(annot);
		} catch (IOException e) {
		}
	}

	private static void addTextHighlight(PDPage page) {
		PDAnnotationTextMarkup annot = new PDAnnotationTextMarkup(PDAnnotationTextMarkup.SUB_TYPE_HIGHLIGHT);

		// Position at center of page.
		Point2D.Float center = getCenterOfPage(page);

        PDRectangle position = new PDRectangle();
        position.setLowerLeftX((float)center.getX() - 80);
        position.setLowerLeftY((float)center.getY() - 15);
        position.setUpperRightX((float)center.getX() + 80);
        position.setUpperRightY((float)center.getY() + 15);
        annot.setRectangle(position);

        float[] quads = new float[8];
        quads[0] = position.getLowerLeftX();	// x1
        quads[1] = position.getUpperRightY();	// y1
        quads[2] = position.getUpperRightX();	// x2
        quads[3] = quads[1];					// y2
        quads[4] = quads[0];					// x3
        quads[5] = position.getLowerLeftY();	// y3
        quads[6] = quads[2];					// x4
        quads[7] = quads[5];					// y4

        annot.setQuadPoints(quads);

        // Set the contents.
		annot.setContents("Hello, World !!");

		// Set color of annotation.
		annot.setColor(new PDColor(new float[] {0.0f, 0.0f, 1.0f, 0.0f}, PDDeviceCMYK.INSTANCE));
		annot.setConstantOpacity(0.8f);

		// Add to page.
		try {
			page.getAnnotations().add(annot);
		} catch (IOException e) {
		}
	}

	private static Point2D.Float getCenterOfPage(PDPage page) {
		PDRectangle bbox = page.getMediaBox();
		float pageWidth = bbox.getWidth();
		float pageHeight = bbox.getHeight();
		return new Point2D.Float(bbox.getLowerLeftX() + pageWidth / 2, bbox.getLowerLeftY() + pageHeight / 2);
	}

	private static void addAction() {
		PDDocument srcDoc = null;

		try {
			srcDoc = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\lorem.pdf"));

			PDActionJavaScript action = new PDActionJavaScript();
			action.setAction("app.alert(\"Hello, World !\", 3)");

			PDDocumentCatalog catalog = srcDoc.getDocumentCatalog();
			catalog.setOpenAction(action);

			srcDoc.save(new File("C:\\Users\\dell\\Desktop\\lorem_open_action.pdf"));

			System.out.println("Document saved successfully !");

		} catch(Exception ex) {
			System.out.println("Failed. " + ex.getMessage());
		} finally {

			if (srcDoc != null) {
				try {
					srcDoc.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void encryptDocument() {
		PDDocument srcDoc = null;

		try {
			srcDoc = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\lorem.pdf"));

			AccessPermission ap = new AccessPermission();
			ap.setCanPrint(false);

			StandardProtectionPolicy spp = new StandardProtectionPolicy("1234", "abcd", ap);
			spp.setEncryptionKeyLength(128);
			spp.setPreferAES(true);

			srcDoc.protect(spp);

			srcDoc.save(new File("C:\\Users\\dell\\Desktop\\lorem_protected.pdf"));

			System.out.println("Document encrypted successfully !");

		} catch(Exception ex) {
			System.out.println("Failed. " + ex.getMessage());
		} finally {

			if (srcDoc != null) {
				try {
					srcDoc.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void rotatePages() {
		PDDocument srcDoc = null;

		try {
			srcDoc = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\lorem.pdf"));

			int numPages = srcDoc.getNumberOfPages();
			for (int i = 0; i < numPages; i++) {
				PDPage page = srcDoc.getPage(i);
				page.setRotation(90);
			}

			srcDoc.save(new File("C:\\Users\\dell\\Desktop\\lorem_rotated.pdf"));

			System.out.println("Document saved successfully !");

		} catch(Exception ex) {
			System.out.println("Failed. " + ex.getMessage());
		} finally {

			if (srcDoc != null) {
				try {
					srcDoc.close();
				} catch (IOException e) {
				}
			}
		}
	}
}
