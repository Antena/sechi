package controllers;

import java.util.List;

import models.User;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created with IntelliJ IDEA. User: dnul Date: 7/29/13 Time: 8:39 PM To change
 * this template use File | Settings | File Templates.
 */
public class UsersController extends Controller {

	public static Result list() {
		if(!isLoggedIn("admin")){
			return forbidden("no tiene permisos");
		}
		List<User> resources = User.getUsers();
		JsonNode json = Json.toJson(resources);
		return ok(json);
	}
	
	static Boolean isLoggedIn(String role) {
		if(session().get("email")==null){
			return false;
		}
		
		User user = User.findByEmail(session().get("email"));
		if(user!=null && user.role.equals(role)){
			return true;
		}
		
		return false;
	}

	static Boolean isLoggedIn() {
		return session().get("email")!=null;
	}

	public static Result get(String id) {
		if(!isLoggedIn("admin")){
			return forbidden("no tiene permisos");
		}
		
		User user = User.findById(id);
		if (user == null) {
			return notFound();
		}

		JsonNode json = Json.toJson(user);
		return ok(json);
	}

	public static Result insert() {
		if(!isLoggedIn("admin")){
			return forbidden("no tiene permisos");
		}
		
		JsonNode postData = request().body().asJson();
		Logger.info(postData.toString());
		User user = Json.fromJson(postData, User.class);
		User findByEmail = User.findByEmail(user.email);
		if(findByEmail!=null && user.getId()==null){
			ObjectNode error = Json.newObject();
			error.put("code", "1");
			error.put("message", "email already exists");
			return badRequest(error);
		}else{
			user.save();
		}
		return ok();
	}

	public static Result update() {
		if(!isLoggedIn("admin")){
			return forbidden("no tiene permisos");
		}
		
		JsonNode postData = request().body().asJson();
		User user = Json.fromJson(postData, User.class);
		//validate oldPassword
		User oldUser = User.findByEmail(session().get("email"));
		String oldPass = postData.get("oldPassword").asText();
//		if (!oldPass.equals(oldUser.password)) {
//			ObjectNode newObject = Json.newObject();
//			newObject.put("error", 2);
//			newObject.put("message", "Wrong password");
//			return forbidden(newObject);
//		}
		
		User.update(user);
		return ok();
	}

	public static Result delete(String id) {
		if(!isLoggedIn("admin")){
			return forbidden("no tiene permisos");
		}
		User.remove(id);
		return ok();
	}

}
