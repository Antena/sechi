package playjongo;

import org.jongo.MongoCollection;
import uk.co.panaxiom.playjongo.*;

/**
 * Created with IntelliJ IDEA.
 * User: dnul
 * Date: 7/29/13
 * Time: 8:34 PM
 * To change this template use File | Settings | File Templates.
 */
public class User {

    public static MongoCollection users() {
        return PlayJongo.getCollection("resources");
    }
}
