package controllers;

import java.util.List;

import models.User;

import org.codehaus.jackson.JsonNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created with IntelliJ IDEA. User: dnul Date: 7/29/13 Time: 8:39 PM To change
 * this template use File | Settings | File Templates.
 */
public class UsersController extends Controller {

	public static Result list() {
		List<User> resources = User.getResources();
		JsonNode json = Json.toJson(resources);
		return ok(json);
	}

	public static Result get(String id) {
		User user = User.findById(id);
		if (user == null) {
			return notFound();
		}

		JsonNode json = Json.toJson(user);
		return ok(json);
	}

	public static Result insert() {
		JsonNode postData = request().body().asJson();
		User User = Json.fromJson(postData, User.class);
		User.save();
		return ok();
	}

	public static Result update() {
		JsonNode postData = request().body().asJson();
		User user = Json.fromJson(postData, User.class);
		User.update(user);
		return ok();
	}

	public static Result delete(String id) {
		User.remove(id);
		return ok();
	}

}
