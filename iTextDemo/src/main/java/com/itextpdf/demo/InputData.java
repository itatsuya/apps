package com.itextpdf.demo;

/*
 * 入力内容を保持する
 */
public class InputData {

    private String font;
    private String name;
    private String number;
    private String period1;
    private String period2;
    private String watermark;

    //	フォント名の取得
	public void setFont(String font) { this.font = font; }

	//	フォント名のセット1
	public String getFont() { return font; }

    //	顧客名の取得
	public String getName() { return name; }

	//	顧客名のセット
	public void setName(String name) { this.name = name; }

	//	受付番号の取得
	public String getNumber() { return number; }

	//	受付番号のセット
	public void setNumber(String number) { this.number = number; }

	//	期間開始日の取得
	public String getPeriod1() { return period1; }

	//	期間開始日のセット
	public void setPeriod1(String period1) { this.period1 = period1; }

	//	期間終了日の取得
	public String getPeriod2() { return period2; }

	//	期間終了日のセット
	public void setPeriod2(String period2) { this.period2 = period2; }

	//	ウォーターマークを出力するかを取得
	public void setWatermark(String watermark) { this.watermark = watermark; }

	//	ウォーターマークを出力するかのセット
	public boolean getIsOutWaterMark() { return watermark != null && watermark.equals("Y"); }

}