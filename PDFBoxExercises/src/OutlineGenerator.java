import java.awt.geom.GeneralPath;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.io.IOException;

import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.color.PDColorSpace;
import org.apache.pdfbox.pdmodel.graphics.color.PDSeparation;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;

public class OutlineGenerator extends PDFGraphicsStreamEngine {

	private PDPage page;
	private GeneralPath path;
	private StringBuilder sb;
	static String COLORANT_NAME_CUt ="CutContour";

	protected OutlineGenerator(PDPage page) {
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

	}

	@Override
	public void strokePath() throws IOException {
		boolean isCutContour = false;
		PDColorSpace colorspace = getGraphicsState().getStrokingColorSpace();
		System.out.println("Faild to save ducument. " + "ZERO");
		if (colorspace instanceof PDSeparation) {
			PDSeparation separationColorSpace = (PDSeparation)colorspace;
			String colorantName = separationColorSpace.getColorantName();
			System.out.println("Faild to save ducument. " + "FIRST");
			if (colorantName.equals(COLORANT_NAME_CUt)) {
				System.out.println("Faild to save ducument. " + "SECOND");
				isCutContour = true;
				//WritePath();
			}
		}

		if (isCutContour) {
			System.out.println("Faild to save ducument. " + "FOUR");
			WritePath();
		}

		//WritePath();
		path.reset();

	}

	private void WritePath() {
		float[] coords = new float[6];
		PathIterator iter = path.getPathIterator(null);

		while(!iter.isDone()) {

			int op = iter.currentSegment(coords);
			switch(op){
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
		    	// x1, y1, x2, y2, x3, y3 curveto
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
		    	// closepath
		    	sb.append("closepath");
		    	sb.append("\n");
				break;
			}

			iter.next();

		}
	}
}
