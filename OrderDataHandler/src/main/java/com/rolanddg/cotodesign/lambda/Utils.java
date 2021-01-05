package com.rolanddg.cotodesign.lambda;

import java.io.File;

public class Utils {

	//private static final Logger LOGGER = Logger.getLogger(Utils.class);

	// method to delete directory
	public static boolean removeDirectory(File dir)
	{
		boolean returnVal = false;
		if (dir.isDirectory()) 
		{
			File[] files = dir.listFiles();
			if (files != null && files.length > 0)
			{
				for (File aFile : files)
				{
					removeDirectory(aFile);
				}
			}
			returnVal = dir.delete();
		} else {
			returnVal = dir.delete();
		}
		
		return returnVal;
	}
}
