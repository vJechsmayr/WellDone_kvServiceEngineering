package com.example.welldone.server.model;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class ProjectListResponse extends BaseServerResponse{

	private List<ProjectListResponseItem> data;
	
	public List<ProjectListResponseItem> getData() {
		return data;
	}

	public void setData(List<ProjectListResponseItem> data) {
		this.data = data;
	}
	
	public static ProjectListResponse fromJson(String json) {
		return new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create().fromJson(json, ProjectListResponse.class);
	}
}
