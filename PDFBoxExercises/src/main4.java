import java.awt.geom.GeneralPath;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.color.PDColorSpace;
import org.apache.pdfbox.pdmodel.graphics.color.PDSeparation;
import org.apache.pdfbox.pdmodel.graphics.form.PDFormXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;

class PDFBoxExample {
	public static void main (String [] arguments) {
		
		// Exercise 1 - Suppress Gloss.
		suppressGlossInk();
		
		// Exercise 3 - Extract Cut outlines.
		//extractOutlines();
	}
	
	private static List<PDSeparation> glossColorSpaces = null;
	
	private static void suppressGlossInk() {
		PDDocument srcDoc = null;
		
		glossColorSpaces = new ArrayList<PDSeparation>();
		
		try {
			srcDoc = PDDocument.load(new File("C:\\users\\dell\\desktop\\PrCMYKGl_imposed.pdf"));
			
			// Collect all RDG_GLOSS colorspaces.
			PDPage page = srcDoc.getPage(0);
			collectResources(page.getResources());
			
			// Change the RDG_GLOSS colorspaces to None.
			for (int i = 0; i < glossColorSpaces.size(); i++) {
				PDSeparation colorSpace = glossColorSpaces.get(i);
				colorSpace.setColorantName("None");
			}
			
			srcDoc.save(new File("C:\\users\\dell\\desktop\\NoGloss_imposed.pdf"));
			
			System.out.println("Document saved successfully !");
			
		} catch(Exception e) {
			System.out.println("Failed to save document.");
		} finally {
			if (srcDoc != null) {
				try {
					srcDoc.close();
				} catch (IOException e) {
				}
			}
		}	
	}
	
	private static void collectResources(PDResources resources) throws IOException {
		for (COSName name : resources.getColorSpaceNames()) {
			PDColorSpace colorSpace = resources.getColorSpace(name);
			
			if (colorSpace instanceof PDSeparation) {
				PDSeparation separationColorSpace = ((PDSeparation)colorSpace);
				String colorantName = separationColorSpace.getColorantName();
				if (colorantName.equals("RDG_GLOSS")) {
					glossColorSpaces.add(separationColorSpace);
				}
			}
		}
		
		// Exercise 2 - Enhance to get resources from forms as well.
		for (COSName name : resources.getXObjectNames()) {
			PDXObject xobject = resources.getXObject(name);
			
			if (xobject instanceof PDFormXObject) {
				PDFormXObject formXObject = (PDFormXObject) xobject;
				collectResources(formXObject.getResources());
			}
		}
	}
		
	private static void extractOutlines() {
		PDDocument srcDocument = null;
		
		try {
			srcDocument = PDDocument.load(new File("C:\\users\\dell\\desktop\\Cut.pdf"));
			
			PDPage page = srcDocument.getPage(0);
			
			OutlineGenerator gen = new OutlineGenerator(page);
			String outlines = gen.getOutlines();
			
			FileOutputStream outputFile = new FileOutputStream("C:\\users\\dell\\desktop\\abc.txt");
			outputFile.write(outlines.getBytes());
			outputFile.close();
			
			System.out.println("Outlines saved successfully !");
		}
		catch (Exception e) {
			System.out.println("Failed to save outlines." + e);
		} finally {
			
			if (srcDocument != null) {
				try {
					srcDocument.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}

class OutlineGenerator extends PDFGraphicsStreamEngine {
	private PDPage page;
	private StringBuilder sb;
	private GeneralPath path;
	
	public OutlineGenerator(PDPage page) {
		super(page);
		
		this.page = page;
		this.path = new GeneralPath();
		this.sb = new StringBuilder();
	}
	
	String getOutlines() throws IOException {
		processPage(this.page);
		
		return sb.toString();
	}

	@Override
	public void appendRectangle(Point2D arg0, Point2D arg1, Point2D arg2, Point2D arg3) throws IOException {
		path.moveTo(arg0.getX(), arg0.getY());
		path.lineTo(arg1.getX(), arg1.getY());
		path.lineTo(arg2.getX(), arg2.getY());
		path.lineTo(arg3.getX(), arg3.getY());
		path.closePath();
	}

	@Override
	public void clip(int arg0) throws IOException {
		path.reset();
	}

	@Override
	public void closePath() throws IOException {
		path.closePath();
	}

	@Override
	public void curveTo(float arg0, float arg1, float arg2, float arg3, float arg4, float arg5) throws IOException {
		path.curveTo(arg0, arg1, arg2, arg3, arg4, arg5);
	}

	@Override
	public void drawImage(PDImage arg0) throws IOException {
		// No-op
	}

	@Override
	public void endPath() throws IOException {
		path.reset();
	}

	@Override
	public void fillAndStrokePath(int arg0) throws IOException {
		strokePath();
	}

	@Override
	public void fillPath(int arg0) throws IOException {
		path.reset();
	}

	@Override
	public Point2D getCurrentPoint() throws IOException {
		return path.getCurrentPoint();
	}

	@Override
	public void lineTo(float arg0, float arg1) throws IOException {
		path.lineTo(arg0, arg1);
	}

	@Override
	public void moveTo(float arg0, float arg1) throws IOException {
		path.moveTo(arg0, arg1);
	}

	@Override
	public void shadingFill(COSName arg0) throws IOException {
		// No-op
	}

	@Override
	public void strokePath() throws IOException {
		// Check if cut path.
		PDColorSpace colorSpace = getGraphicsState().getStrokingColorSpace();
		if (colorSpace instanceof PDSeparation) {
			PDSeparation separationColorSpace = (PDSeparation)colorSpace;
			if (separationColorSpace.getColorantName().equals("CutContour")) {
				WritePath();
			}
		}

		path.reset();
	}
	
	private void WritePath() {
		float[] coords = new float[6];
		PathIterator iter = path.getPathIterator(null);
		
		while (!iter.isDone()) {
			
			int op = iter.currentSegment(coords);
			switch(op) {
			case PathIterator.SEG_MOVETO:
				// x y moveto
				sb.append(coords[0]);
				sb.append(" ");
				sb.append(coords[1]);
				sb.append(" moveto");
				sb.append("\n");
				break;
				
			case PathIterator.SEG_LINETO:
				// x y lineto
				sb.append(coords[0]);
				sb.append(" ");
				sb.append(coords[1]);
				sb.append(" lineto");
				sb.append("\n");
				break;
				
			case PathIterator.SEG_CUBICTO:
				// x1 y1 x2 y2 x3 y3 curveto
				sb.append(coords[0]);
				sb.append(" ");
				sb.append(coords[1]);
				sb.append(" ");
				sb.append(coords[2]);
				sb.append(" ");
				sb.append(coords[3]);
				sb.append(" ");
				sb.append(coords[4]);
				sb.append(" ");
				sb.append(coords[5]);
				sb.append(" ");
				sb.append(" curveto");
				sb.append("\n");
				break;
				
			case PathIterator.SEG_CLOSE:
				sb.append("closepath");
				sb.append("\n");
				break;
			}
			
			iter.next();
		}
	}
}
