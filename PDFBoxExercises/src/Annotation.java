import java.awt.geom.Point2D;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceCMYK;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationRubberStamp;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationText;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup;

public class Annotation  {

	public static void addTextAnnotation(PDPage page) {
		PDAnnotationText annot = new PDAnnotationText();

		// Position at center of page.
		Point2D.Float center = getCenterOfPage(page);

        PDRectangle position = new PDRectangle();
        position.setLowerLeftX((float)center.getX() - 10);
        position.setLowerLeftY((float)center.getY() - 20);
        position.setUpperRightX((float)center.getX() + 10);
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

	public static void addStampAnnotation(PDPage page) {
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
        String stampName = PDAnnotationRubberStamp.NAME_APPROVED;
        //annot.setName("SBApproved");
        annot.setName("SB" + stampName); // SBをつけないとなぜが表示しない。これはPDFBoxライブラリがちょっとおかしい

        // Set the contents.
		annot.setContents("RDG Approved");

		// Set color of icon.
		annot.setColor(new PDColor(new float[] {1.0f, 0.0f, 0.0f}, PDDeviceRGB.INSTANCE));

		// set Noview
		//annot.setAnnotationFlags(32); // 32 : NoView (6bit Position)

		// Add to page.
		try {
			page.getAnnotations().add(annot);
		} catch (IOException e) {
		}

	}

	public static void addTextHighlight(PDPage page) {
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
}
