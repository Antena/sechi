package utils;

import play.Play;

public class PlayConfig {

    public static String getString(String key) {
        return Play.application().configuration().getString(key);
    }

    public static Integer getInt(String key) {
        return Play.application().configuration().getInt(key);
    }

    public static Boolean getBoolean(String key) {
        return Play.application().configuration().getBoolean(key);
    }
}
