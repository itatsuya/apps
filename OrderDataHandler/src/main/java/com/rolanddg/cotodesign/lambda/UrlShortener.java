package com.rolanddg.cotodesign.lambda;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TimerTask;
import java.util.Timer;

class UrlShortenerData {
	private String url;
	private Timestamp creationTime; 

	public UrlShortenerData(String queryParams, Timestamp now) {
		url = queryParams;
		creationTime = now;
	}
	public void setQueryParam(String url) {
		this.url = url;
	}
	public void setCreationTime(Timestamp creationTime) {
		this.creationTime = creationTime;
	}
	public String getQueryParam() {
		return url;
	}
	public Timestamp getCreationTime() {
		return creationTime;
	}
}

class PurgeTask extends TimerTask {
	@Override
	public void run() {
		UrlShortener.purge();
	}
}

public class UrlShortener {
	private static HashMap<String, UrlShortenerData> idToUrlMap = new HashMap<String, UrlShortenerData>();
	private static HashMap<String, String> urlToidMap = new HashMap<String, String>();

	static long PURGE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hrs 
	static long TIME_TO_LIVE = 60 * 60 * 1000; // 1 hrs
	static String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	static SecureRandom rnd = new SecureRandom();

	public static void initialize()
	{
    	Timer timer = new Timer();
    	PurgeTask task = new PurgeTask();
    	timer.scheduleAtFixedRate(task, 0, PURGE_INTERVAL);
	}

	public synchronized static String addQueryParam(String queryParam)
	{
		String id;
		if (urlToidMap.containsKey(queryParam)) {
			// Already mapped?
			id = urlToidMap.get(queryParam);
		} else {
			// Generate new ID and add.
			id = generateNextID(6);
			while (idToUrlMap.containsKey(id)) {
				id = generateNextID(6);
			}

			Timestamp now = new Timestamp(System.currentTimeMillis());
			UrlShortenerData record = new UrlShortenerData(queryParam, now);
			idToUrlMap.put(id, record);
			urlToidMap.put(queryParam, id);
		}
		return id;
	}

	public synchronized static String getQueryParam(String paramID)
	{
		String queryParam = null;
		UrlShortenerData data = idToUrlMap.get(paramID);
		if (data != null) {
			Timestamp now = new Timestamp(System.currentTimeMillis());
			data.setCreationTime(now);
			queryParam = data.getQueryParam();
		}
		return queryParam;
	}
	
	public static HashMap<String, String> getQueryParamMap(String paramID)
	{
		String queryParam = getQueryParam(paramID);
		if (queryParam == null) {
			return null;
		}

		HashMap<String, String> paramMap = new HashMap<String, String>();
		String[] params = queryParam.split("&");

		for (String param : params) {
			String[] paramsKeyValue = param.split("=");
			if (paramsKeyValue.length == 2) {
				paramMap.put(paramsKeyValue[0].trim(), paramsKeyValue[1].trim());
			}
		}
		return paramMap;
	}

	private static String generateNextID(int len) {
		StringBuilder sb = new StringBuilder(len);
		for(int i = 0; i < len; i++) {
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		}
		return sb.toString();
	}

	public synchronized static void purge()
	{
		// Remove stale entries.
		Timestamp now = new Timestamp(System.currentTimeMillis());
		Iterator<Map.Entry<String, UrlShortenerData>> iterator = idToUrlMap.entrySet().iterator();
		
		while(iterator.hasNext()) {
			UrlShortenerData data = iterator.next().getValue();
			Timestamp creationTime = data.getCreationTime();
			long diff = now.getTime() - creationTime.getTime();
			if (diff > TIME_TO_LIVE) {
				String url = data.getQueryParam();
				iterator.remove();
				urlToidMap.remove(url);
			}
		}
	}
}
