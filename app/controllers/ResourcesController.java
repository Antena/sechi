package controllers;

import static play.mvc.Results.ok;

import java.util.List;

import org.codehaus.jackson.JsonNode;

import models.Resource;
import play.libs.Json;
import play.mvc.Result;

/**
 * Created with IntelliJ IDEA.
 * User: dnul
 * Date: 7/29/13
 * Time: 8:39 PM
 * To change this template use File | Settings | File Templates.
 */
public class ResourcesController {


    public static Result list() {
        List<Resource> resources = Resource.getResources();
        JsonNode json = Json.toJson(resources);
        return ok(json);
    }
    
    public static Result get(String id) {
        Resource resource = Resource.findById(id);
        JsonNode json = Json.toJson(resource);
        return ok(json);
    }
    
    
    public static Result update() {
        return ok();
    }
}
