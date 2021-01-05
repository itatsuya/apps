import java.awt.geom.Point2D;
import java.io.IOException;

import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;

public class DefaultExtendPDFGraphicsStreamEngine  extends PDFGraphicsStreamEngine {

	protected DefaultExtendPDFGraphicsStreamEngine(PDPage page) {
		super(page);
		// TODO 自動生成されたコンストラクター・スタブ
	}

	@Override
	public void appendRectangle(Point2D arg0, Point2D arg1, Point2D arg2, Point2D arg3) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void drawImage(PDImage arg0) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void clip(int arg0) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void moveTo(float arg0, float arg1) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void lineTo(float arg0, float arg1) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void curveTo(float arg0, float arg1, float arg2, float arg3, float arg4, float arg5) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public Point2D getCurrentPoint() throws IOException {
		// TODO 自動生成されたメソッド・スタブ
		return null;
	}

	@Override
	public void closePath() throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void endPath() throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void strokePath() throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void fillPath(int arg0) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void fillAndStrokePath(int arg0) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void shadingFill(COSName arg0) throws IOException {
		// TODO 自動生成されたメソッド・スタブ

	}

}
