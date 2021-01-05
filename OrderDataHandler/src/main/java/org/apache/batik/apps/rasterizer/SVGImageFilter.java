package org.apache.batik.apps.rasterizer;

import java.awt.image.BufferedImage;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Objects;

import javax.imageio.ImageIO;

import org.apache.batik.bridge.ImageFilter;
import org.apache.batik.util.ParsedURL;
import org.apache.commons.io.FileUtils;

public class SVGImageFilter implements ImageFilter {

	private String tempFolder;
	
	private HashMap<ImageFilterKey, ParsedURL> cachedImages;
	
	public SVGImageFilter() {
		this.tempFolder = System.getProperty("java.io.tmpdir");
		this.cachedImages = new HashMap<ImageFilterKey, ParsedURL>();
	}
	
	// Lookup tables for image correction.
	private int[] m_contrastTable = null;
	private int m_cachedContrast = -1;
	
	private int[] m_gammaTable = null;
	private int m_cachedGamma = -1;
	
	private void initContrastTable(int contrast)
	{
		if (contrast == m_cachedContrast) {
			return;
		}
		
		m_contrastTable = new int[256];
		for (int i = 0; i < 256; i++) {
			m_contrastTable[i] = (i - 127) *  (100 + contrast) / (100 - contrast) + 127;
			if (m_contrastTable[i] < 0) {
				m_contrastTable[i] = 0;
			} else if (m_contrastTable[i] > 255) {
				m_contrastTable[i] = 255;
			}
		}
		m_cachedContrast = contrast;
	}
	
	private void initGammaTable(int gamma)
	{
		if (gamma == m_cachedGamma) {
			return;
		}
		
		double r;
		if (gamma < 0) {
			r =  1000.0 / (double)(1000 + gamma);
		} else {
			r = 100.0 / (double)(gamma + 100);
		}
		
		m_gammaTable = new int[256];
		for (int i = 0; i < 256; i++) {
			m_gammaTable[i] = (int)(Math.pow((double)i / 255.0, r) * 255.0);
			if (m_gammaTable[i] < 0) {
				m_gammaTable[i] = 0;
			} else if (m_gammaTable[i] > 255) {
				m_gammaTable[i] = 255;
			}
	     }
		m_cachedGamma = gamma;
	}
	
	public void setTempFolder(String folder) {
		tempFolder = folder;
	}
	
	public String getTempFolder() {
		return tempFolder;
	}
	
	private class ImageFilterKey {
		private ParsedURL purl;
		private int brightness;
		private int contrast;
		private int gamma;
		private boolean invert;
		
		public ImageFilterKey(ParsedURL purl, int brightness, int contrast, int gamma, boolean invert) {
			this.purl = purl;
			this.brightness = brightness;
			this.contrast = contrast;
			this.gamma = gamma;
			this.invert = invert;
		}
		
		@Override
	    public boolean equals(Object o) {
			if (this == o) return true;
	        if (o == null || getClass() != o.getClass()) return false;
	        ImageFilterKey key = (ImageFilterKey) o;
	        boolean result = (invert == key.invert) && 
	        		(brightness == key.brightness) && 
	        		(contrast == key.contrast) && 
	        		(gamma == key.gamma) && 
	        		(purl.getPath().equalsIgnoreCase(key.purl.getPath()));
			return result;
		}
		
		@Override
	    public int hashCode() {
			return Objects.hash(purl, brightness, contrast, gamma, invert);
		}
	}
	
	@Override
	public ParsedURL processImage(ParsedURL purl, HashMap attributes) {
		// Images with data urls do not require any processing at this point.
		if (purl.getProtocol().equalsIgnoreCase("data")) {
			return purl;
		}
		
		ParsedURL newPurl = purl;

		int brightness = 0, contrast = 0, gamma = 0;
		boolean invert = false, filter = false;
		
		if (attributes.containsKey("data-filtered")) {
			filter = Boolean.parseBoolean(attributes.get("data-filtered").toString());
		}
		if (!filter) {
			return purl;
		}
		
		if (attributes.containsKey("data-brightness")) {
			brightness = (int) Float.parseFloat(attributes.get("data-brightness").toString());
		}
		if (attributes.containsKey("data-contrast")) {
			contrast = (int) Float.parseFloat(attributes.get("data-contrast").toString());
		}
		if (attributes.containsKey("data-gamma")) {
			gamma = (int) Float.parseFloat(attributes.get("data-gamma").toString());
		}
		if (attributes.containsKey("data-invert")) {
			invert = Boolean.parseBoolean(attributes.get("data-invert").toString());
		}
		
		// Check if we have seen this image with the same filter parameters before.
		ImageFilterKey key = new ImageFilterKey(purl, brightness, contrast, gamma, invert);
		if (cachedImages.containsKey(key)) {
			return cachedImages.get(key);
		}
		
		BufferedImage bufferedImage;
		String fileName, fileFormat;
		try {
			URL url = new URL(purl.toString());
			File file = FileUtils.toFile(url);
			fileName = file.getName();
			fileFormat = fileName.substring(fileName.lastIndexOf(".") + 1);
			fileName = fileName.substring(0, fileName.lastIndexOf("."));
			bufferedImage = ImageIO.read(file);
		} catch (IOException e) {
			//TODO
			return purl;
		}
		
		boolean filtered = filterImage(bufferedImage, brightness, contrast, gamma, invert);
		if (filtered) {
			// Image was filtered. Save it out.
			try {
				File destFile = new File(tempFolder, fileName + "." + fileFormat);
				int i = 1;
				while (destFile.exists()) {
					destFile = new File(tempFolder, fileName + i++ + "." + fileFormat);
				}
				ImageIO.write(bufferedImage, fileFormat, destFile);
				newPurl = new ParsedURL("file:/" + destFile.getAbsolutePath().replaceAll("\\\\", "/"));
				cachedImages.put(key, newPurl);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return newPurl;
	}
	
	private boolean filterImage(BufferedImage image, int brightness, int contrast, int gamma, boolean invert)
	{
		int width = image.getWidth();
		int height = image.getHeight();
		
		if (gamma != 0) {
			initGammaTable(gamma);
		}
		if (contrast != 0) {
			initContrastTable(contrast);
		}
		
		boolean needToFilter = true;
		
		// We can get either grayscale ABGR or GRAY images here.
		if (image.getType() == BufferedImage.TYPE_BYTE_GRAY) {
			needToFilter = brightness != 0 || contrast != 0 || gamma != 0 || invert;
			if (needToFilter) {
				WritableRaster dstColorRaster = image.getRaster();
				int[] pixels = dstColorRaster.getPixels(0, 0, width, height, (int[]) null);
				
				for (int i = 0; i < pixels.length; i++) {
					int nGray = (int) pixels[i] & 0xFF;
					if (nGray == 0) {
						if (invert) {
							pixels[i] = 255;
						}
						continue;
					}
					
					// Gamma correction.
					if (gamma != 0) {
						nGray = m_gammaTable[nGray];
					}
					// Adjust contrast.
					if (contrast != 0) {
						nGray = m_contrastTable[nGray];
					}
					// Adjust brightness.
					if (brightness != 0) {
						nGray += brightness;
					}
					
					if (nGray < 0) {
						nGray = 0;
					} else if (nGray > 255) {
						nGray = 255;
					}
					pixels[i] = invert ? 255- nGray : nGray;
				}
				dstColorRaster.setPixels(0, 0, width, height, pixels);
			}
		} else {
			// TYPE_4BYTE_ABGR
			WritableRaster dstColorRaster = image.getRaster();
			int[] pixels = dstColorRaster.getPixels(0, 0, width, height, (int[]) null);
			
			int nGray, alpha;
			float alphaRatio;
			for (int i = 0; i < pixels.length; i += 4) {
				nGray = pixels[i]; // Assumes grayscale RGB image
				alpha = pixels[i + 3];
				alphaRatio = alpha / 255.0f;
				nGray = (int) (nGray * alphaRatio);
				
				if (nGray == 0) {
					if (invert) {
						pixels[i] = 255;
						pixels[i + 2] = pixels[i + 1] = pixels[i];
					}
				} else {
					// Gamma correction.
					if (gamma != 0) {
						nGray = m_gammaTable[nGray];
					}
					// Adjust contrast.
					if (contrast != 0) {
						nGray = m_contrastTable[nGray];
					}
					// Adjust brightness.
					if (brightness != 0) {
						nGray += brightness;
					}
					
					if (nGray < 0) {
						nGray = 0;
					} else if (nGray > 255) {
						nGray = 255;
					}
					pixels[i] = invert ? 255 - nGray : nGray;
					pixels[i + 2] = pixels[i + 1] = pixels[i];
				}
				pixels[i + 3] = (alpha > 0) ? 255 : 0;
			}
			dstColorRaster.setPixels(0, 0, width, height, pixels);
		}
		return needToFilter;
	}
}
