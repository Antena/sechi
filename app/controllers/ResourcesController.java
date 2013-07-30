package controllers;

import java.util.List;

import models.Resource;

import org.codehaus.jackson.JsonNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created with IntelliJ IDEA. User: dnul Date: 7/29/13 Time: 8:39 PM To change
 * this template use File | Settings | File Templates.
 */
public class ResourcesController extends Controller {

	public static Result list() {
		List<Resource> resources = Resource.getResources();
		JsonNode json = Json.toJson(resources);
		return ok(json);
	}

	public static Result get(String id) {
		Resource resource = Resource.findById(id);
		if (resource == null) {
			return notFound();
		}

		JsonNode json = Json.toJson(resource);
		return ok(json);
	}

	public static Result insert() {
		JsonNode postData = request().body().asJson();
		Resource resource = Json.fromJson(postData, Resource.class);
		resource.save();
		return ok();
	}

	public static Result update() {
		JsonNode postData = request().body().asJson();
		Resource resource = Json.fromJson(postData, Resource.class);
		Resource.update(resource);
		return ok();
	}

	public static Result delete(String id) {
		Resource.remove(id);
		return ok();
	}

}
