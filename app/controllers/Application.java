package controllers;

import java.security.MessageDigest;

import models.User;
import play.Logger;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

public class Application extends Controller {

	public static Result index() {
		if (session("email") == null){
			return ok(views.html.login.render(Form.form(Login.class)));
		}

		String email = session("email");
		User user = User.findByEmail(email);
		return ok(index.render("Your new application is ready.",user));
	}

	public static class Login {

		public String email;
		public String password;

		public String validate() {
			if (User.authenticate(email, password) == null) {
				return "Email o contraseña incorrectos";
			}
			return null;
		}

	}

	/**
	 * Login page.
	 */
	public static Result login() {
		if (session("email") == null){
			Logger.info(session("email"));
			return ok(views.html.login.render(Form.form(Login.class)));
		}else {
			return redirect(routes.Application.index());
		}
	}

	/**
	 * Handle login form submission.
	 */
	public static Result authenticate() {

		Form<Login> loginForm = Form.form(Login.class).bindFromRequest();
		if (loginForm.hasErrors()) {
			return badRequest(views.html.login.render(loginForm));
		} else {
			session("email", loginForm.get().email);
			String uri = session("uri");
			if (uri != null)
				return redirect(uri);
			else
				return redirect(routes.Application.index());
		}

	}

	/**
	 * Logout and clean the session.
	 */
	public static Result logout() {
		session().clear();
		flash("success", "Has finalizado tu sesión");
		return redirect(routes.Application.login());
	}

}
