package controllers;

import java.util.List;

import models.Resource;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.JsonNodeFactory;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.mongodb.DBObject;

/**
 * Created with IntelliJ IDEA. User: dnul Date: 7/29/13 Time: 8:39 PM To change
 * this template use File | Settings | File Templates.
 */
public class ResourcesController extends Controller {

	public static Result list() {
		if(!UsersController.isLoggedIn()){
			return forbidden("no tiene permisos");
		}
		ArrayNode array = new ArrayNode(JsonNodeFactory.instance);
		List<DBObject> resources = Resource.getResources();

		for (DBObject obj : resources) {
			JsonNode resource = Json.parse(obj.toString());
			array.add(resource);
		}

		return ok(array);
	}

	public static Result get(String id) {
		if(!UsersController.isLoggedIn()){
			return forbidden("no tiene permisos");
		}
		DBObject resource = Resource.findById(id);
		if (resource == null) {
			return notFound();
		}

		JsonNode json = Json.parse(resource.toString());
		return ok(json);
	}

	public static Result insert() {
		if(!UsersController.isLoggedIn()){
			return forbidden("no tiene permisos");
		}
		JsonNode postData = request().body().asJson();
		Resource.save(postData);
		return ok();
	}

	public static Result update() {
		if(!UsersController.isLoggedIn()){
			return forbidden("no tiene permisos");
		}
		JsonNode postData = request().body().asJson();
		Resource.update(postData);
		return ok();
	}

	public static Result delete(String id) {
		if(!UsersController.isLoggedIn()){
			return forbidden("no tiene permisos");
		}
		Resource.remove(id);
		return ok();
	}

}
