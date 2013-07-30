package models;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.oid.Id;

import uk.co.panaxiom.playjongo.PlayJongo;

public class Resource {

	@org.jongo.marshall.jackson.oid.ObjectId
	@Id
	private String id;
	
	public String name;

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
		return resources().findOne(new ObjectId(id)).as(Resource.class);
	}

	public static void update(Resource resource) {
		resources().save(resource);
	}
	

	public static void remove(String id) {
		resources().remove(new ObjectId(id));
	}

	public void save() {
		resources().save(this);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}