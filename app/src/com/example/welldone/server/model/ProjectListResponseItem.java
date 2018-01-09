package com.example.welldone.server.model;

import java.util.Date;

public class ProjectListResponseItem {

	private int id;
	private int ownerId;
	private String ownerfirstname;
	private String ownerlastname;
	private String title;
	private String status;
	private String type;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(int ownerId) {
		this.ownerId = ownerId;
	}
	public String getOwnerfirstname() {
		return ownerfirstname;
	}
	public void setOwnerfirstname(String ownerFirstName) {
		this.ownerfirstname = ownerFirstName;
	}
	public String getOwnerlastname() {
		return ownerlastname;
	}
	public void setOwnerlastname(String ownerLastName) {
		this.ownerlastname = ownerLastName;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
