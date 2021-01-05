package com.itextpdf.demo;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceCmyk;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;

/**
 * PDFファイルを生成する
 */
public class PdfCreator {

	private static final String IMG_ORANGE_BAR = "src/main/resources/static/image/orangeBar.png";
    //private static final String IMG_LOGO = "src/main/resources/static/image/itextLogo.png";
	private static final String IMG_LOGO = "src/main/resources/static/image/RolandLogo.png";
    private static final String IMG_STAMP = "src/main/resources/static/image/stamp.jpg";

    private static final String FONT_FOLDER = "src/main/resources/fonts/";

    private static final String WATER_MARK_TEXT = "SAMPLE";

    /*
     * PDFの作成
     */
    public void createPdf(InputData inputData, String outFileName) throws IOException
    {
		PdfDocument pdfDoc = createNewPdf(outFileName);

		try (Document doc = new Document(pdfDoc)) {
			setDefaultFont(doc, inputData);
			addHeaderData(pdfDoc, doc, inputData);
			addText(doc, inputData);
			addTable(doc);
			addStampImage(doc);
			if(inputData.getIsOutWaterMark()) addWaterMark(pdfDoc, doc);
		}
    }

	/*
	 * 新規PDFの作成
	 */
	private PdfDocument createNewPdf(String outFileName) throws IOException
	{
		PdfDocument pdfDoc = new PdfDocument(new PdfWriter(outFileName));
		pdfDoc.setDefaultPageSize(PageSize.A4);
		return pdfDoc;
	}

	/*
	 * デフォルトフォントの設定
	 */
	private void setDefaultFont(Document doc, InputData inputData) throws IOException
	{
		String fontPath = FONT_FOLDER + inputData.getFont();
		PdfFont font = PdfFontFactory.createFont(fontPath, PdfEncodings.IDENTITY_H, true);
		doc.setFontSize(12).setFont(font);
	}

	/*
	 * ヘッダ部に画像と見積番号を追加
	 */
	private void addHeaderData(PdfDocument pdfDoc, Document doc, InputData inputData) throws IOException
	{
		//	ここでは画像を文字と同じ扱いとして追加します。(Wordの行内画像のようなイメージです)
		//	よって、ページ上部から段落として画像が追加されます。
		//	この方法ですと、画像がPDFのページ上の段落から成り行きで追加されます。

		Image orange = new Image(ImageDataFactory.create(IMG_ORANGE_BAR));
        doc.add(orange);

        //	受付番号
        doc.add(new Paragraph("\n"));
        Paragraph numberPara = new Paragraph("受付No. :" + inputData.getNumber() + "\n");
        numberPara.setTextAlignment(TextAlignment.RIGHT).setUnderline();	//	この段落だけ下線、右寄せにする
        doc.add(numberPara);

        //	QRコード
        BarcodeQRCode barcode = new BarcodeQRCode();
        //	PDF417のバーコード
        //BarcodePDF417 barcode = new BarcodePDF417();
        barcode.setCode("iText:" + inputData.getNumber());
        Image barcodeImg = new Image(barcode.createFormXObject(ColorConstants.BLACK, pdfDoc)).scale(2, 2);
        doc.add(barcodeImg.setHorizontalAlignment(HorizontalAlignment.RIGHT));

        //	ロゴ画像
        Image logo = new Image(ImageDataFactory.create(IMG_LOGO));
        logo.scaleToFit(100, 28);
        doc.add(logo);

        doc.add(new Paragraph("\n"));
	}

	/*
	 * 段落文字の追加
	 */
	private void addText(Document doc, InputData inputData)
	{
		Color blue = new DeviceRgb(2, 72, 119);
		Color orange = new DeviceCmyk(0, 37, 86, 3);
		Color black = new DeviceCmyk(75, 68, 67, 90);

		//	タイトルはフォントサイズ24pt、中央寄せ、太字で出力
        Paragraph titlePara = new Paragraph("オンラインショッピング").setFontColor(black);
        titlePara.add(new Text("払込票").setFontColor(black));
        titlePara.setTextAlignment(TextAlignment.CENTER).setFontSize(24).setBold();
        doc.add(titlePara);

        //	タイトルと顧客名の間に段落2つ分のスペースを空ける
        doc.add(new Paragraph("\n"));
        doc.add(new Paragraph("\n"));

        doc.add(new Paragraph("お客様名 : " + inputData.getName() + "様"));
        doc.add(new Paragraph("ご注文日 : " + new SimpleDateFormat("yyyy/MM/dd").format(new Date())));
        doc.add(new Paragraph("支払期限 : " + inputData.getPeriod1() + " ～ " + inputData.getPeriod2()));

        doc.add(new Paragraph("\n"));

        //	A4横の新規ページを追加し、改ページを挿入します
        //doc.getPdfDocument().addNewPage(PageSize.A4.rotate());
        //doc.add(new AreaBreak());
	}

	/*
	 * 表の追加(このデモでは表の内容は固定になっています)
	 */
	private void addTable(Document doc)
	{
		//	ページ幅に対して100%の4列の表を作成
		Table table = new Table(UnitValue.createPercentArray(4)).useAllAvailableWidth();

		//	ヘッダ行のセルを追加(ヘッダ行は表が複数ページに跨る場合、前ページの先頭に表示されます)
        table.addHeaderCell(createHeaderCell("商品名"));
        table.addHeaderCell(createHeaderCell("単価"));
        table.addHeaderCell(createHeaderCell("数量"));
        table.addHeaderCell(createHeaderCell("販売価格"));

        //	1行分のセルを追加
        table.addCell(new Cell().setTextAlignment(TextAlignment.LEFT).add(new Paragraph("コーヒー")));
        table.addCell("\\1,000");
        table.addCell("3ケース");
        table.addCell("\\3,000").setHorizontalAlignment(HorizontalAlignment.RIGHT);

        //	1行分のセルを追加
        table.addCell(new Cell().setTextAlignment(TextAlignment.LEFT).add(new Paragraph("緑茶")));
        table.addCell("\\800");
        table.addCell("2ケース");
        table.addCell("\\1,600").setHorizontalAlignment(HorizontalAlignment.RIGHT);

        //	1行分のセルを追加
        table.addCell(new Cell().setTextAlignment(TextAlignment.LEFT).add(new Paragraph("ミネラルウォーター")));
        table.addCell("\\1,200");
        table.addCell("1ダース");
        table.addCell("\\1,200").setHorizontalAlignment(HorizontalAlignment.RIGHT);

        //	消費税行のセルを追加
        Cell cell = new Cell(2, 2);	//	空白分のセル(2×2)
        cell.setBorderLeft(Border.NO_BORDER);
        cell.setBorderBottom(Border.NO_BORDER);
        table.addCell(cell);
        table.addCell("消費税(8%)").setHorizontalAlignment(HorizontalAlignment.RIGHT);
        table.addCell("\\464").setTextAlignment(TextAlignment.RIGHT);

        //	合計行のセルを追加
        table.addCell("合 計").setHorizontalAlignment(HorizontalAlignment.RIGHT);
        table.addCell("\\6,264").setTextAlignment(TextAlignment.RIGHT);

        //	表の幅を設定し、表自体のアライメントを中央に設定します
        //table.setWidth(360);
        //table.setHorizontalAlignment(HorizontalAlignment.CENTER);
        doc.add(table);
	}

	/*
	 * ヘッダ行用のセルの作成(背景色とアライメントを設定しています)
	 */
	private Cell createHeaderCell(String text)
	{
		Cell cell = new Cell();
		cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
		cell.setTextAlignment(TextAlignment.CENTER);
		cell.add(new Paragraph(text));
		return cell;
	}

	/*
	 * スタンプ画像の追加
	 */
	private void addStampImage(Document doc) throws IOException
	{
		//	ここではページ上の位置を指定して画像を追加しています。

        Image stamp = new Image(ImageDataFactory.create(IMG_STAMP));

        //	画像の幅と高さを指定
        stamp.scaleToFit(100, 100);

        //	ページ左下を原点とし、X=450, Y=160の位置に画像を配置
        stamp.setFixedPosition(1, 450, 160);

        doc.add(stamp);
	}

	/*
	 * ウォーターマークの追加
	 */
	private void addWaterMark(PdfDocument pdfDoc, Document doc)
	{
		PdfPage page =pdfDoc.getPage(1);
        Rectangle pageSize = page.getPageSize();

        //	フォントサイズは128pt、色は透明度30%のグレー
        Paragraph p = new Paragraph(WATER_MARK_TEXT).setFontSize(128);
        p.setFontColor(ColorConstants.GRAY, (float) 0.3);

        //	ページ幅、高さに対して50%の範囲に中央寄せで、45度の角度で出力
        doc.showTextAligned(p, pageSize.getWidth() / 2, pageSize.getHeight() / 2, 1,
        		TextAlignment.CENTER, VerticalAlignment.MIDDLE, 45);
	}
}