import java.awt.geom.GeneralPath;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.multipdf.LayerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.PDPageContentStream.AppendMode;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDColorSpace;
import org.apache.pdfbox.pdmodel.graphics.color.PDSeparation;
import org.apache.pdfbox.pdmodel.graphics.form.PDFormXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.util.Matrix;

class PDFBoxExample {
	public static void main3 (String [] arguments) {
		// Exercise 1 - Imposition
		//createImposedDocument();
		//createImposedDocument2();

		// Exercise 2 - Rasterization
		//rasterizeDocument();
		//rasterizeDocument2();

		// Exercise 3 - Extract outlines
		extractOutlines();
	}

	private static void createImposedDocument() {
		PDDocument document = null;
		PDDocument srcDocument = null;

		try {
			document = new PDDocument();

			PDPage page = new PDPage();

			PDRectangle mediaBox = new PDRectangle();
			mediaBox.setLowerLeftX(0.0f);
			mediaBox.setLowerLeftY(0.0f);;
			mediaBox.setUpperRightX(mmToPoints(230));
			mediaBox.setUpperRightY(mmToPoints(220));
			page.setMediaBox(mediaBox);

			PDPageContentStream contents = new PDPageContentStream(document, page, AppendMode.OVERWRITE, false);

			// Get the contents of the Order PDF. Add to the imposed PDF contents.
			LayerUtility layerUtility = new LayerUtility(document);

			//sunflowers_100x200.pdf
			srcDocument = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\sunflowers_100x200.pdf"));

			PDFormXObject form = layerUtility.importPageAsForm(srcDocument, 0);

			contents.saveGraphicsState();
			Matrix matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f, mmToPoints(10.0f), mmToPoints(10.0f));
			contents.transform(matrix);
			contents.drawForm(form);
			contents.restoreGraphicsState();

			contents.saveGraphicsState();
			matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f, mmToPoints(120.0f), mmToPoints(10.0f));
			contents.transform(matrix);
			contents.drawForm(form);
			contents.restoreGraphicsState();

			contents.close();

			document.addPage(page);
			document.save("C:\\users\\dell\\desktop\\ex1.pdf");

			System.out.println("Document saved successfully.");

		} catch (IOException e) {
			System.out.println("Failed to save document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch (IOException e) {
				}
			}

			if (srcDocument != null) {
				try {
					srcDocument.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void createImposedDocument2() {
		PDDocument document = null;
		PDDocument srcDocument1 = null;
		PDDocument srcDocument2 = null;

		try {
			document = new PDDocument();

			PDPage page = new PDPage();

			PDRectangle mediaBox = new PDRectangle();
			mediaBox.setLowerLeftX(0.0f);
			mediaBox.setLowerLeftY(0.0f);;
			mediaBox.setUpperRightX(mmToPoints(500));
			mediaBox.setUpperRightY(mmToPoints(460));
			page.setMediaBox(mediaBox);

			PDPageContentStream contents = new PDPageContentStream(document, page);

			// Get the contents of the Order PDF. Add to the imposed PDF contents.
			LayerUtility layerUtility = new LayerUtility(document);

			//sunflowers_100x200.pdf
			srcDocument1 = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\sunflowers_100x200.pdf"));
			srcDocument2 = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\stars_100x200.pdf"));

			PDFormXObject form1 = layerUtility.importPageAsForm(srcDocument1, 0);
			PDFormXObject form2 = layerUtility.importPageAsForm(srcDocument2, 0);

			showFormAt(contents, form1, 380.0f,  20.0f);
			showFormAt(contents, form1, 260.0f,  20.0f);
			showFormAt(contents, form1, 140.0f,  20.0f);
			showFormAt(contents, form1,  20.0f,  20.0f);
			showFormAt(contents, form1, 380.0f, 240.0f);

			showFormAt(contents, form2, 260.0f, 240.0f);
			showFormAt(contents, form2, 140.0f, 240.0f);

			contents.close();

			document.addPage(page);
			document.save("C:\\users\\dell\\desktop\\ex1.pdf");

			System.out.println("Document saved successfully.");

		} catch (IOException e) {
			System.out.println("Failed to save document." + e);
		} finally {
			if (document != null) {
				try {
					document.close();
				} catch (IOException e) {
				}
			}

			if (srcDocument1 != null) {
				try {
					srcDocument1.close();
				} catch (IOException e) {
				}
			}

			if (srcDocument2 != null) {
				try {
					srcDocument2.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void rasterizeDocument() {
		PDDocument srcDocument = null;

		try {
			//sunflowers_100x200.pdf
			srcDocument = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\sunflowers_100x200.pdf"));

			PDFRenderer renderer = new PDFRenderer(srcDocument);
			BufferedImage image = renderer.renderImageWithDPI(0, 300.0f, ImageType.RGB);

			File outputImageFile = new File("C:\\Users\\dell\\Desktop\\sunflowers_100x200.jpg");
			ImageIO.write(image, "JPG", outputImageFile);

			System.out.println("Image saved successfully.");

		} catch (IOException e) {
			System.out.println("Failed to rasterize document." + e);
		} finally {
			if (srcDocument != null) {
				try {
					srcDocument.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void rasterizeDocument2() {
		PDDocument srcDocument = null;

		try {
			//mario_80x80.pdf
			srcDocument = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\mario_80x80.pdf"));

			PDFRenderer renderer = new PDFRenderer(srcDocument);
			BufferedImage image = renderer.renderImageWithDPI(0, 353.0f, ImageType.GRAY);

			//File outputImageFile = new File("C:\\Users\\dell\\Desktop\\mario_100x200.jpg");
			//ImageIO.write(image, "JPG", outputImageFile);

			DataBufferByte byteBuffer = (DataBufferByte) image.getData().getDataBuffer();
			byte[] pixels = byteBuffer.getData(0);

			FileOutputStream outputImageFile = new FileOutputStream("C:\\Users\\dell\\Desktop\\mario_100x200.raw");

			// Write the image pixels to the output image file as raw data.
			outputImageFile.write(pixels);
			outputImageFile.close();

			System.out.println("Image saved successfully.");

		} catch (IOException e) {
			System.out.println("Failed to rasterize document." + e);
		} finally {
			if (srcDocument != null) {
				try {
					srcDocument.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void extractOutlines() {
		PDDocument srcDocument = null;

		try {
			//mario_80x80.pdf
			srcDocument = PDDocument.load(new File("C:\\Users\\dell\\Desktop\\mario_80x80.pdf"));

			PDPage srcPage = srcDocument.getPage(0);
			OutlineGenerator gen = new OutlineGenerator(srcPage);
			String outlines = gen.getOutlines();

			FileOutputStream outputFile = new FileOutputStream("C:\\Users\\dell\\Desktop\\mario_100x200_outlines.txt");
			outputFile.write(outlines.getBytes());
			outputFile.close();

			System.out.println("Outlines saved successfully.");

		} catch (IOException e) {
			System.out.println("Failed to rasterize document." + e);
		} finally {
			if (srcDocument != null) {
				try {
					srcDocument.close();
				} catch (IOException e) {
				}
			}
		}
	}

	private static void showFormAt(PDPageContentStream contents, PDFormXObject form, float x, float y) throws IOException {
		contents.saveGraphicsState();
		Matrix matrix = new Matrix(1.0f, 0.0f, 0.0f, 1.0f, mmToPoints(x), mmToPoints(y));
		contents.transform(matrix);
		contents.drawForm(form);
		contents.restoreGraphicsState();
	}

	private static float mmToPoints(float mm) {
		float inches = mm / 25.4f;
		return inches * 72.0f;
	}
}

class OutlineGenerator extends PDFGraphicsStreamEngine {
	private PDPage page;
	private GeneralPath linePath;
	private StringBuilder sb;
	private static double EPSILON = 0.001;

	protected OutlineGenerator(PDPage page) {
		super(page);
		this.page = page;
		this.linePath = new GeneralPath();
		this.sb = new StringBuilder();
	}

	public String getOutlines() throws IOException {
		processPage(page);

		return sb.toString();
	}

	private void WriteOutline() {
		float[] coords = new float[6];
		PathIterator iter = linePath.getPathIterator(null);

		sb.append("newpath");
		sb.append("\n");

		while (!iter.isDone())
		{
			int op = iter.currentSegment(coords);
			switch (op) {
			case PathIterator.SEG_MOVETO:
				// x, y moveto
				WriteCoord(coords[0]);
				sb.append(" ");
				WriteCoord(coords[1]);
				sb.append(" moveto");
				sb.append("\n");
				break;
			case PathIterator.SEG_LINETO:
				// x, y lineto
				WriteCoord(coords[0]);
				sb.append(" ");
				WriteCoord(coords[1]);
				sb.append(" lineto");
				sb.append("\n");
				break;
			case PathIterator.SEG_CUBICTO:
				// x1, y1, x2, y2, x3, y3 curveto
				WriteCoord(coords[0]);
				sb.append(" ");
				WriteCoord(coords[1]);
				sb.append(" ");
				WriteCoord(coords[2]);
				sb.append(" ");
				WriteCoord(coords[3]);
				sb.append(" ");
				WriteCoord(coords[4]);
				sb.append(" ");
				WriteCoord(coords[5]);
				sb.append(" curveto");
				sb.append("\n");
				break;
			case PathIterator.SEG_CLOSE:
				// closepath
				sb.append("closepath");
				sb.append("\n");
				break;
			}
			iter.next();
		}

		sb.append("stroke");
		sb.append("\n");
	}

	private void WriteCoord(float c) {
		sb.append(Math.abs(c) < EPSILON ? 0 : c);
	}

	@Override
	public void appendRectangle(Point2D arg0, Point2D arg1, Point2D arg2, Point2D arg3) throws IOException {
		linePath.moveTo((float)arg0.getX(), (float)arg0.getY());
		linePath.lineTo((float)arg1.getX(), (float)arg1.getY());
		linePath.lineTo((float)arg2.getX(), (float)arg2.getY());
		linePath.lineTo((float)arg3.getX(), (float)arg3.getY());
		linePath.closePath();
	}

	@Override
	public void clip(int arg0) throws IOException {
		linePath.reset();
	}

	@Override
	public void closePath() throws IOException {
		linePath.closePath();
	}

	@Override
	public void curveTo(float arg0, float arg1, float arg2, float arg3, float arg4, float arg5) throws IOException {
    	linePath.curveTo(arg0, arg1, arg2, arg3, arg4, arg5);
	}

	@Override
	public void drawImage(PDImage arg0) throws IOException {
		// No-op
	}

	@Override
	public void endPath() throws IOException {
		linePath.reset();
	}

	@Override
	public void fillAndStrokePath(int arg0) throws IOException {
		// Not interested in fill. Just call stroke.
		strokePath();
	}

	@Override
	public void fillPath(int arg0) throws IOException {
		// Just reset the path for fill.
		linePath.reset();
	}

	@Override
	public Point2D getCurrentPoint() throws IOException {
    	return linePath.getCurrentPoint();
	}

	@Override
	public void lineTo(float arg0, float arg1) throws IOException {
		linePath.lineTo(arg0, arg1);
	}

	@Override
	public void moveTo(float arg0, float arg1) throws IOException {
		linePath.moveTo(arg0, arg1);
	}

	@Override
	public void shadingFill(COSName arg0) throws IOException {
		// No-op
	}

	@Override
	public void strokePath() throws IOException {
		if (isOutlineStroke()) {
			WriteOutline();
		}
		linePath.reset();
	}

    private boolean isOutlineStroke()
    {
    	PDColor strokeColor = getGraphicsState().getStrokingColor();
    	PDColorSpace colorSpace = strokeColor.getColorSpace();

    	if (colorSpace instanceof PDSeparation) {
    		PDSeparation separationColorSpace = (PDSeparation) colorSpace;
    		String colorantName = separationColorSpace.getColorantName();
    		if (colorantName.equals("Outline"))
    			return true;
    	}

    	return false;
    }
}
