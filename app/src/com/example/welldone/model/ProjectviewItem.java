package com.example.welldone.model;


public class ProjectviewItem {
	private String title;
	private String status;
	private String owner;
	private	String start;
	private String end;
	private String type;
	
	public ProjectviewItem(String title, String owner, String status, String start, String end, String type) {
		super();
		this.title = title;
		this.status = status;
		this.owner = owner;
		this.start = start;
		this.end = end;
		this.type = type;
	}
	
	public String getTitle() {
		return title;
	}
	public String getOwner() {
		return owner;
	}
	public String getType(){
		return type;
	}
	public String getStatus() {
		return status;
	}
	public String getStartDate() {
		return start;
	}
	public String getEndDate() {
		return end;
	}
}