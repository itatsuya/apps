package com.rolanddg.cotodesign.lambda;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.sql.Timestamp;
import java.util.Base64;

import org.apache.batik.apps.rasterizer.BatikRasterizer;
import org.apache.batik.apps.rasterizer.SVGConverter;
import org.apache.batik.apps.rasterizer.SVGConverterException;
import org.apache.batik.apps.rasterizer.SVGImageFilter;
import org.json.JSONException;
import org.json.JSONObject;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;

public class OrderDataHandler implements RequestStreamHandler {
	//private static final Logger LOGGER = Logger.getLogger(OrderDataServlet.class);
	private MyLogger LOGGER = new MyLogger();

	class MyLogger {
		private StringBuilder sb;

		MyLogger() {
			sb = new StringBuilder();
		}

		public void info(String infomsg) {
			sb.append("INFO: ");
			sb.append(infomsg);
			sb.append(" \n ");
		}

		public void error(String errormsg) {
			sb.append("ERROR: ");
			sb.append(errormsg);
			sb.append(" \n ");
		}

		public void error(Exception ex) {
			error(ex.getMessage());
		}

		public String getLog() {
			return sb.toString();
		}

		public void clear() {
			sb.setLength(0);
		}
	}

	public static final String LOCAL_STORAGE_PATH = "/tmp";
	public static final String ORDER_DATA_FOLDER = "order-data";
	private static final String DESIGN_FILE_NAME = "product_design.svg";
	private static final String THUMB_FILE_NAME = "product_design.png";
	private static final String FOIL_THUMB_FILE_NAME = "product_design_foil.png";
	private static final String METAL_THUMB_FILE_NAME = "product_design_metal.png";
	private static final String PDF_FILE_NAME = "product_design.pdf";
	private static final String ORDER_DATA_FILE_NAME = "order-data.json";
	private static final String USER_IMAGES_FOLDER_NAME = "user-images";
	private static final String TEMP_FOLDER = "svg-conv-filtered-images";

	private static final String TEMP_ORDER_FOLDER_NAME_PREFIX = "";

	private static final String ENCODING_PREFIX = "base64,";

	//SVG Conversion Errors
	private static final int SVG_ERROR_NOT_DEF_GLYPH = 1;

	//Print types
	private static final String PRINT_TYPE_COLOR = "color";
	private static final String PRINT_TYPE_FOIL = "foil";
	private static final String PRINT_TYPE_METAL = "metal";

	public OrderDataHandler() {
	}

	public static void main(String[] args) {
		/*OrderDataHandler order = new OrderDataHandler();
		File inputFile = new File("F:\\backup\\input.txt");
		File outputFile = new File("F:\\backup\\output.txt");
		try {
			InputStream input = new FileInputStream(inputFile);
			OutputStream output = new FileOutputStream(outputFile);
			order.handleRequest(input, output, null);
		} catch (Exception e) {
			e.printStackTrace();
		}*/
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		LOGGER.clear();
		//JSONParser parser = new JSONParser();
	    BufferedReader reader = new BufferedReader(new InputStreamReader(input));
	    JSONObject responseJson = new JSONObject();
	    try {
	        //JSONObject request = (JSONObject) parser.parse(reader);
	    	String line = null;
	    	StringBuffer writer = new StringBuffer();
	    	while((line = reader.readLine())!=null) {
	    		writer.append(line);
	    	}

	    	JSONObject request = new JSONObject(writer.toString());

	        JSONObject responseBody = new JSONObject();
	        if (request != null) {
	        	if(request.has("body")) {
	        		LOGGER.info("request has body");
	        		JSONObject requestBody = new JSONObject(request.getString("body"));
	        		doPost(requestBody, responseBody);
	        	}
	        	else {
	        		LOGGER.info("request do not have body");
	        		doPost(request, responseBody);
	        	}

	        }

	        responseBody.put("message", "New item created");

	        JSONObject headerJson = new JSONObject();
	        headerJson.put("x-custom-header", "my custom header value");
	        headerJson.put("Access-Control-Allow-Origin", "*");

	        responseJson.put("isBase64Encoded", false);
	        responseJson.put("statusCode", 200);
	        responseJson.put("headers", headerJson);
	        responseJson.put("body", responseBody.toString());

	    } catch (JSONException pex) {
	        try {
				responseJson.put("statusCode", 400);
		        responseJson.put("exception", pex);
			} catch (JSONException e) {
				LOGGER.error(pex);
			}

	    }

	    OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
	    writer.write(responseJson.toString());
	    writer.close();
     }
	/* Generate Order Id according to the following rules.
	 * Rule: month (2 digits) + year (1 alphabet) + serial number
	 * Example: 04A00001, 04A00002
	 * Month: 01 - 12 : 01 = January, 02 = February, ..., 12 = December
	 * Year: A to Z : A = 2017, B = 2018, ..., Z = 2042. When it reaches Z, it returns to A.
	 * Serial number: 00001 to 99999.
	 * Reset the number at the beginning of the month. Stored procedure get_next_order_id() does the reset job.
	 */
	private String generateOrderId(int orderNum, int month, int year)
	{
		year = (year - 2017) % 26;

		char yearCh = (char) ('A' + year);
		String monthStr = String.format("%02d", month);
		String orderNumStr = String.format("%05d", orderNum);

		StringBuffer orderIdStrBuff = new StringBuffer();
		String orderId = orderIdStrBuff.append(monthStr).append(yearCh).append(orderNumStr).toString();

		return orderId;
	}

	//private void convertSVGToPDF(File svgFile, File outputPDFFile, HttpServletRequest request, String printType) throws SVGConverterException{
	private void convertSVGToPDF(File svgFile, File outputPDFFile, JSONObject request, String printType) throws SVGConverterException{

		/*String[] args = new String[]{"-d", "C:/Roland/RolandKioskPrint/Batik/rkpSample/design4.pdf", "-m", "application/pdf", "-cssUser",
		"C:/Roland/RolandKioskPrint/Batik/rkpSample/ubuntu-regular-latin.css", "C:/Roland/RolandKioskPrint/Batik/rkpSample/design4.svg"};*/

		/*String contextRealPath = getServletContext().getRealPath("");
		contextRealPath = contextRealPath.replace("\\", "/");

		String cssPath = null;

		if(contextRealPath.endsWith("/")){
			cssPath = "file:///" + contextRealPath + "designer/resources/fonts-css/fonts.css";
		}else{
			cssPath = "file:///" + contextRealPath + "/designer/resources/fonts-css/fonts.css";
		}*/
		//String cssPath = "https://s3.ap-south-1.amazonaws.com/com.rolanddg.cotodesign/fonts-css/fonts.css";
		String cssPath = "https://s3-ap-northeast-1.amazonaws.com/com.rolanddg.cotodesign-2/resources/fonts-css/fonts.css";

		String[] args = new String[7];
		args[0] = "-d";
		args[1] = outputPDFFile.getAbsolutePath();
		args[2] = "-m";
		args[3] = "application/pdf";
		args[4] = "-cssUser";
		args[5] = cssPath;
		args[6] = svgFile.getAbsolutePath();

		LOGGER.info("creating batik raterizer");
		BatikRasterizer rasterizer = new BatikRasterizer(args);

		if (printType.equalsIgnoreCase(PRINT_TYPE_METAL)) {
			rasterizer.setSVGImageFilter(createImageFilter());
			rasterizer.setIgnoreColorProfile(true);
		}
		LOGGER.info("executing rasterizer");
		rasterizer.execute();
		LOGGER.info("rasterizer executed");
	}

	//private String getFolderPathForFilteredImages(HttpServletRequest request) {
	private String getFolderPathForFilteredImages() {
		//String path = USER_IMAGES_FOLDER_NAME + "/" + request.getSession().getId() + "/" + TEMP_FOLDER;

		//path = request.getServletContext().getRealPath(path);
		String path = LOCAL_STORAGE_PATH + "/" + USER_IMAGES_FOLDER_NAME + "/" + TEMP_FOLDER;
		File tempFolder = new File(path);
		if (!tempFolder.exists())
		{
			tempFolder.mkdirs();
		}
		return path;
	}

	//private SVGImageFilter createImageFilter(HttpServletRequest request) {
	private SVGImageFilter createImageFilter() {
        String tempImagesFolder = getFolderPathForFilteredImages();
    	SVGImageFilter imageFilter = new SVGImageFilter();
    	imageFilter.setTempFolder(tempImagesFolder);
    	return imageFilter;
	}

	private void createFiles(String productDesignSVG, String productDesignPNG, String productDesignImprintPNG, JSONObject orderData,
			File designFile, File thumbFile, File imprintThumbFile, File orderDataFile) throws IOException{
		FileOutputStream designFileOutputStream = null;
		FileOutputStream thumbFileOutputStream = null;
		FileOutputStream foilThumbFileOutputStream = null;
		FileOutputStream orderDataFileOutputStream = null;

		byte[] productDesignSVGValue = null;
		byte[] productDesignPNGValue = null;
		byte[] productDesignFoilPNGValue = null;

		int index = 0;

		index = productDesignSVG.indexOf(ENCODING_PREFIX);
		if (index != -1) {
			index += ENCODING_PREFIX.length();
			productDesignSVGValue = Base64.getMimeDecoder().decode(productDesignSVG.substring(index));
		} else {
			productDesignSVGValue = Base64.getMimeDecoder().decode(productDesignSVG);
		}

		index = productDesignPNG.indexOf(ENCODING_PREFIX);
		if (index != -1) {
			index += ENCODING_PREFIX.length();
			productDesignPNGValue = Base64.getMimeDecoder().decode(productDesignPNG.substring(index));
		} else {
			productDesignPNGValue = Base64.getMimeDecoder().decode(productDesignPNG);
		}

		if (productDesignImprintPNG != null)
		{
			index = productDesignImprintPNG.indexOf(ENCODING_PREFIX);
			if (index != -1) {
				index += ENCODING_PREFIX.length();
				productDesignFoilPNGValue = Base64.getMimeDecoder().decode(productDesignImprintPNG.substring(index));
			} else {
				productDesignFoilPNGValue = Base64.getMimeDecoder().decode(productDesignImprintPNG);
			}
		}

		try{
			designFileOutputStream = new FileOutputStream(designFile);
			designFileOutputStream.write(productDesignSVGValue);

			thumbFileOutputStream = new FileOutputStream(thumbFile);
			thumbFileOutputStream.write(productDesignPNGValue);

			if (imprintThumbFile != null) {
				foilThumbFileOutputStream = new FileOutputStream(imprintThumbFile);
				foilThumbFileOutputStream.write(productDesignFoilPNGValue);
			}

			orderDataFileOutputStream = new FileOutputStream(orderDataFile);
			orderDataFileOutputStream.write(orderData.toString().getBytes(Charset.forName("UTF-8")));
		} finally {
			if (thumbFileOutputStream != null) {
				thumbFileOutputStream.close();
			}
			if (foilThumbFileOutputStream != null) {
				foilThumbFileOutputStream.close();
			}
			if (designFileOutputStream != null) {
				designFileOutputStream.close();
			}
			if (orderDataFileOutputStream != null) {
				orderDataFileOutputStream.close();
			}
		}
	}

	private String getTempFolderName()
	{
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());
		String folderName = TEMP_ORDER_FOLDER_NAME_PREFIX + timestamp.getTime();
		return folderName;
	}

	protected void doPost(JSONObject request, JSONObject response)
			throws IOException {
		// initializing local variables
		boolean taskCompleted = false;

		File tempUploadDir = null;

		try {
			// getting directory path
			String tempUploadPath = LOCAL_STORAGE_PATH + "/" + ORDER_DATA_FOLDER + "/" + getTempFolderName();
			//tempUploadPath = tempUploadPath.replace("\\", "/");
			tempUploadDir = new File(tempUploadPath);

			while (tempUploadDir.exists()) {
				//This may happen in case of a highly concurrent multi client environment.
				//Ensure the temp folder is a new one.
				tempUploadPath = LOCAL_STORAGE_PATH + "/" + ORDER_DATA_FOLDER + "/" + getTempFolderName();
				//tempUploadPath = tempUploadPath.replace("\\", "/");
				tempUploadDir = new File(tempUploadPath);
			}

			// Creating a fresh directory
			tempUploadDir.mkdirs();

			String productDesignSVG = request.getString("productDesign");
			String productDesignPNG = request.getString("productDesignThumb");
			String productDesignFoilPNG = null;
			String productDesignMetalPNG = null;
			String productDesignImprintPNG = null;

			String printType = PRINT_TYPE_COLOR;
			if (request.has("productDesignFoilThumb")) {
				productDesignFoilPNG = request.getString("productDesignFoilThumb");
				request.remove("productDesignFoilThumb");
				printType = PRINT_TYPE_FOIL;
			} else if (request.has("productDesignMetalThumb")) {
				productDesignMetalPNG = request.getString("productDesignMetalThumb");
				request.remove("productDesignMetalThumb");
				printType = PRINT_TYPE_METAL;
			}

			LOGGER.info("Order received with print type: " + printType);

			File designFile = new File(tempUploadDir, DESIGN_FILE_NAME);
			File thumbFile = new File(tempUploadDir, THUMB_FILE_NAME);
			File imprintThumbFile = null;
			File orderDataFile = new File(tempUploadDir, ORDER_DATA_FILE_NAME);

			// Delete productDesignSVG and productDesignPNG from JSON Object
			request.remove("productDesign");
			request.remove("productDesignThumb");

			if (productDesignFoilPNG != null) {
				productDesignImprintPNG = productDesignFoilPNG;
				imprintThumbFile = new File(tempUploadDir, FOIL_THUMB_FILE_NAME);
			} else if (productDesignMetalPNG != null) {
				productDesignImprintPNG = productDesignMetalPNG;
				imprintThumbFile = new File(tempUploadDir, METAL_THUMB_FILE_NAME);
			}

			createFiles(productDesignSVG, productDesignPNG, productDesignImprintPNG, request, designFile, thumbFile, imprintThumbFile, orderDataFile);

			LOGGER.info("Converting Order SVG to PDF.");
			convertSVGToPDF(designFile, new File(tempUploadDir, PDF_FILE_NAME), request, printType);

			String productOrderID = tempUploadDir.getName(); //addOrderDataInDB(request);

			if(productOrderID != null) {
				//String uploadPath = LOCAL_STORAGE_PATH + "/" + ORDER_DATA_FOLDER + "/" + productOrderID;
				//uploadPath = uploadPath.replace("\\", "/");
				S3Utils ob = new S3Utils("AKIA4KRNOUVYIASQTIWZ", "hO+SppQzEWHzAQg6xze1n2uNcIF3NCrNwJShz4V4", "ap-northeast-1");
				ob.upload("com.rolanddg.cotodesign-2", "order-data/" + productOrderID, tempUploadDir);

				taskCompleted = true;
				response.put("uplo", true);
				LOGGER.info("Order created successfully.");
			}

			if (taskCompleted) {
				response.put("success", true);
				response.put("productOrderId", productOrderID);
			} else {
				response.put("success", false);
			}

		} catch (Exception e) {
			try {
				response.put("success", false);

				if(e instanceof SVGConverterException) {
					SVGConverterException ex = (SVGConverterException) e;
					if(ex.getErrorCode().equals(SVGConverter.ERROR_WHILE_RASTERIZING_FILE)) {
						String errorMessage = ex.getMessage();
						if(errorMessage.contains("Notdef glyph used")) {
							response.put("errorType", SVG_ERROR_NOT_DEF_GLYPH);
						}
					}
				}

			} catch (JSONException e1) {
				LOGGER.error(e1);
			}
			LOGGER.error(e);
		} /*finally {
			//In case the temp folder hasn't been moved because of any error, delete it.
			if(tempUploadDir != null && tempUploadDir.exists()){
				Utils.removeDirectory(tempUploadDir);
			}

			try {
				response.put("log", LOGGER.getLog());
			} catch(Exception ex) {
			}
		}*/
	}
}
