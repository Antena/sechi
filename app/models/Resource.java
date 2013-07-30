package models;

import org.bson.types.ObjectId;
import org.jongo.Find;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.oid.Id;

import play.libs.Json;
import uk.co.panaxiom.playjongo.PlayJongo;

import java.util.ArrayList;
import java.util.List;


public class Resource {
	
	@org.jongo.marshall.jackson.oid.ObjectId
	@Id
	private String id;

    public static MongoCollection resources() {
        return PlayJongo.getCollection("resources");
    }


    public static List<Resource> getResources() {
        List<Resource> resp = new ArrayList<Resource>();
        Iterable<Resource> resources = resources().find().as(Resource.class);
        for (Resource r : resources) {
            resp.add(r);
        }

        return resp;
    }


	public static Resource findById(String id) {
		return resources().findOne(id).as(Resource.class);
	}
	
	public static void update(Resource resource) {
		resources().update("{_id:#}",new ObjectId(resource.getId())).merge(resource);
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}
}