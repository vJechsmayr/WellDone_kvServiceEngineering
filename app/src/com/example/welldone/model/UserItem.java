package com.example.welldone.model;


public class UserItem {
	private String firstname;
	private String lastname;
	private String mail;
	private	String pwd;
	private boolean admin;
	private boolean active;
	
	public UserItem(String firstname, String lastname, String mail, String pwd, boolean admin, boolean active) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.mail = mail;
		this.pwd = pwd;
		this.admin = admin;
		this.active = active;
	}
	
	public String getFirstname() {
		return firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public String getMail(){
		return mail;
	}
	public String getPassword() {
		return pwd;
	}
	public boolean isAdmin() {
		return admin;
	}
	public boolean isActive() {
		return active;
	}
}