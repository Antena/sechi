package models;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.codehaus.jackson.JsonNode;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.oid.Id;

import uk.co.panaxiom.playjongo.PlayJongo;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class Resource {

	@org.jongo.marshall.jackson.oid.ObjectId
	@Id
	private String id;

	public String name;

	public static MongoCollection resources() {
		return PlayJongo.getCollection("resources");
	}

	public static List<DBObject> getResources() {
		List<DBObject> objects = new ArrayList<DBObject>();
		DBCursor find = resources().getDBCollection().find();

		while (find.hasNext()) {
			DBObject next = find.next();
			objects.add(next);
		}

		return objects;
	}

	public static DBObject findById(String id) {
		return resources().getDBCollection().findOne(new ObjectId(id));
	}

	public static void update(JsonNode postData) {
		BasicDBObject query = new BasicDBObject("_id", postData.get("id"));
		Object parse = com.mongodb.util.JSON.parse(postData.toString());
		resources().getDBCollection().update(query, (DBObject) parse);
	}

	public static void remove(String id) {
		resources().remove(new ObjectId(id));
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public static void save(JsonNode postData) {
		DBObject parse =(DBObject) com.mongodb.util.JSON.parse(postData.toString());
		JsonNode id = postData.get("_id");
		if(id!=null)
			parse.put("_id", new ObjectId(id.asText()));
		
		resources().getDBCollection().save(parse);
	}
}