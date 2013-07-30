package models;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.oid.Id;

import uk.co.panaxiom.playjongo.PlayJongo;

public class User {

	@org.jongo.marshall.jackson.oid.ObjectId
	@Id
	public String id;

	public String name;

	public String lastName;

	//hash
	public String password;

	public static MongoCollection users() {
		return PlayJongo.getCollection("users");
	}

	public static List<User> getResources() {
		List<User> resp = new ArrayList<User>();
		Iterable<User> resources = users().find().as(User.class);
		for (User r : resources) {
			resp.add(r);
		}

		return resp;
	}

	public static User findById(String id) {
		return users().findOne(new ObjectId(id)).as(User.class);
	}

	public static void update(User user) {
		users().save(user);
	}

	public static void remove(String id) {
		users().remove(new ObjectId(id));
	}

	public void save() {
		users().save(this);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
