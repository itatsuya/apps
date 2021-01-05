package com.rolanddg.cotodesign.lambda;

import java.io.File;

import org.apache.log4j.Category;
import org.apache.log4j.Logger;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class S3Utils {

	private static LambdaLogger logger = (LambdaLogger) Logger.getLogger(S3Utils.class);
	private String awsAccessKey;
	private String awsSecretKey;
	private String awsRegionName;

	/** S3 service */
	private AmazonS3 s3Service = null;

	public S3Utils(String awsAccessKey, String awsSecretKey, String awsRegionName){
		this.awsAccessKey = awsAccessKey;
		this.awsSecretKey = awsSecretKey;
		this.awsRegionName = awsRegionName;
		AWSCredentials awsCredentials = new BasicAWSCredentials(getAwsAccessKey(), getAwsSecretKey());
		s3Service = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).withRegion(Regions.AP_SOUTH_1).build();
	}

	public void upload(String bucketName, String keyName, File filePath) {

		try {
		    s3Service.putObject(bucketName, keyName, filePath);
		} catch (AmazonServiceException e) {
			((Category) logger).error("Error in creating/ updating object with key " + keyName + " !", e);
		}
	}

	/**
	 * set AWS credentials
	 **/

	public String getAwsAccessKey() {
		return awsAccessKey;
	}

	public void setAwsAccessKey(String awsAccessKey) {
		this.awsAccessKey = awsAccessKey;
	}

	public String getAwsSecretKey() {
		return awsSecretKey;
	}

	public void setAwsSecretKey(String awsSecretKey) {
		this.awsSecretKey = awsSecretKey;
	}

	public String getAwsRegionName() {
		return awsRegionName;
	}

	public void setAwsRegionName(String awsRegionName) {
		this.awsRegionName = awsRegionName;
	}

}
