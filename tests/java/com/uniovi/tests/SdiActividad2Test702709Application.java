package com.uniovi.tests;

import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.uniovi.tests.pageobjects.PO_HomeView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.SeleniumUtils;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringRunner.class)
@SpringBootTest
public class SdiActividad2Test702709Application {

	// En Windows (Debe ser la versi�n 65.0.1 y desactivar las
	// actualizacioens autom�ticas)):
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "lib/geckodriver024win64.exe";

	// //Comun a Windows y Macosx
	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URLLOCAL = "https://localhost:8080/";
	static String URLREMOTA = "CENSURADO PARA DESCLASIFICACIÓN";
	static String URL = URLLOCAL;

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@Before
	public void setUp() throws Exception {
		driver.navigate().to("https://localhost:8080/resetdbrapido");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() throws Exception {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
	}

	@AfterClass
	static public void end() {
		driver.quit();
	}

	@Test
	public void PR01() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "boromir@gondor.nz", "Boromir", "Hijo De Denethor", "Osgiliath", "Osgiliath");
		// Comprobamos que entramos en la secci�n privada
		PO_View.checkElement(driver, "text", "Ofertas destacadas");
	}

	@Test
	public void PR02() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.

		PO_RegisterView.fillForm(driver, "", "Garrus", "Vakarian", "N7N7N7", "N7N7N7");
		PO_View.getP();
		PO_View.checkElement(driver, "text", "No puede haber campos vacíos");

		PO_RegisterView.fillForm(driver, "arcangel@omega.ci", "", "Vakarian", "N7N7N7", "N7N7N7");
		PO_View.getP();
		PO_View.checkElement(driver, "text", "No puede haber campos vacíos");

		PO_RegisterView.fillForm(driver, "arcangel@omega.ci", "Garrus", "", "N7N7N7", "N7N7N7");
		PO_View.getP();
		PO_View.checkElement(driver, "text", "No puede haber campos vacíos");

		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "arcangel@omega.ci", "Garrus", "Vakarian", "N7N7N7", "N7N7N");
		PO_View.getP();
		PO_View.checkElement(driver, "text", "Las contraseñas no coinciden");

	}

	@Test
	public void PR03() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "cruzadaeterna@gmail.com", "Faramir", "Hijo De Denethor", "3age", "3age");
		PO_View.getP();
		PO_View.checkElement(driver, "text", "Ya existe ese usuario");
	}

	@Test
	public void PR04() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		PO_HomeView.clickOptionById(driver, "userdropdown", "id", "seeusers");
	}

	@Test
	public void PR05() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "armaggeddon");
		PO_View.checkElement(driver, "id", "loginbtn");
	}

	@Test
	public void PR06() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "", "kjdasjkf");
		PO_View.checkElement(driver, "id", "loginbtn");

		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "");
		PO_View.checkElement(driver, "id", "loginbtn");
	}

	@Test
	public void PR07() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "rogal-dorn@hotmail.com", "damnthecodex");
		PO_View.checkElement(driver, "id", "loginbtn");
	}

	@Test
	public void PR08() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_HomeView.clickOptionById(driver, "offerdropdown", "id", "addoffer");

		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
		PO_View.checkElement(driver, "id", "loginbtn");
	}

	@Test
	public void PR09() {

		SeleniumUtils.textoNoPresentePagina(driver, "Cerrar sesión");
	}

	@Test
	public void PR10() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		PO_HomeView.clickOptionById(driver, "userdropdown", "id", "seeusers");

		PO_HomeView.clickOptionById(driver, "seeusers", "id", "tableUsers");

		PO_View.checkElement(driver, "free", "//td[contains(text(), 'CENSURADO PARA DESCLASIFICACIÓN@uniovi.es')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'cruzadaeterna@gmail.com')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'armaggedon41@hotmail.com')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'helsreach@yahoo.es')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'alpha-legion@gmail.com')]");
	}

	@Test
	public void PR11() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		PO_HomeView.clickOptionById(driver, "userdropdown", "id", "seeusers");

		PO_HomeView.clickOptionById(driver, "seeusers", "id", "tableUsers");
		List<WebElement> eliminar = PO_View.checkElement(driver, "free", "//input[contains(@class,'checkable')]");
		String id = eliminar.get(0).getAttribute("id");

		List<WebElement> email = PO_View.checkElement(driver, "free", "//td[contains(@class, '" + id + "')]");
		String tx = email.get(0).getAttribute("value");
		eliminar.get(0).click();

		PO_HomeView.clickOptionById(driver, "deleteButton", "id", "tableUsers");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, tx, PO_View.getTimeout());

	}

	@Test
	public void PR12() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		PO_HomeView.clickOptionById(driver, "userdropdown", "id", "seeusers");

		PO_HomeView.clickOptionById(driver, "seeusers", "id", "tableUsers");

		List<WebElement> eliminar = PO_View.checkElement(driver, "free", "//input[contains(@class,'checkable')]");
		String id = eliminar.get(0).getAttribute("id");

		List<WebElement> email = PO_View.checkElement(driver, "free", "//td[contains(@class, '" + id + "')]");
		String tx = email.get(0).getAttribute("value");
		eliminar.get(eliminar.size() - 1).click();

		PO_HomeView.clickOptionById(driver, "deleteButton", "id", "tableUsers");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, tx, PO_View.getTimeout());

	}

	@Test
	public void PR13() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		PO_HomeView.clickOptionById(driver, "userdropdown", "id", "seeusers");

		PO_HomeView.clickOptionById(driver, "seeusers", "id", "tableUsers");

		List<WebElement> eliminar = PO_View.checkElement(driver, "free", "//input[contains(@class,'checkable')]");
		String id1 = eliminar.get(1).getAttribute("id");
		String id2 = eliminar.get(2).getAttribute("id");
		String id3 = eliminar.get(3).getAttribute("id");

		List<WebElement> email1 = PO_View.checkElement(driver, "free", "//td[contains(@class, '" + id1 + "')]");
		String tx1 = email1.get(0).getAttribute("value");
		List<WebElement> email2 = PO_View.checkElement(driver, "free", "//td[contains(@class, '" + id2 + "')]");
		String tx2 = email2.get(0).getAttribute("value");
		List<WebElement> email3 = PO_View.checkElement(driver, "free", "//td[contains(@class, '" + id3 + "')]");
		String tx3 = email3.get(0).getAttribute("value");

		eliminar.get(1).click();
		eliminar.get(2).click();
		eliminar.get(3).click();

		PO_HomeView.clickOptionById(driver, "deleteButton", "id", "tableUsers");

		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, tx1, PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, tx2, PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, tx3, PO_View.getTimeout());
	}

	@Test
	public void PR14() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/add')]", 0);

		PO_PrivateView.fillFormAddOffer(driver, "Nanomáquinas", "Se activan en respuesta al trauma físico", "666",
				"2019-03-04", false);
		// Comprobamos que aparece la nota en la pagina
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Nanomáquinas", PO_View.getTimeout());
	}

	@Test
	public void PR15() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/add')]", 0);

		PO_PrivateView.fillFormAddOffer(driver, "", "Se activan en respuesta al trauma físico", "666", "2019-03-04",
				false);

		PO_View.getP();
		PO_View.checkElement(driver, "text", "Longitud del título inválida.");

	}

	@Test
	public void PR16() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listown')]", 0);

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tr");
		Assert.assertTrue(elementos.size() == 4);
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Guitarra española')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'La Divina Comedia')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'TES III: Morrowind')]");
	}

	@Test
	public void PR17() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listown')]", 0);

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tr");
		Assert.assertTrue(elementos.size() == 4);
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Guitarra española')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'La Divina Comedia')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'TES III: Morrowind')]");

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'Guitarra española')]/following-sibling::*/a[contains(@href, 'offer/delete')]",
				0);
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tr", PO_View.getTimeout());
		Assert.assertTrue(elementos.size() == 3);
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Guitarra española", PO_View.getTimeout());
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'La Divina Comedia')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'TES III: Morrowind')]");
	}

	@Test
	public void PR18() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listown')]", 0);

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tr");
		Assert.assertTrue(elementos.size() == 4);
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Guitarra española')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'La Divina Comedia')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'TES III: Morrowind')]");

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'TES III: Morrowind')]/following-sibling::*/a[contains(@href, 'offer/delete')]",
				0);
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "TES III: Morrowind", PO_View.getTimeout());
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tr", PO_View.getTimeout());
		Assert.assertTrue(elementos.size() == 3);
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'La Divina Comedia')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Guitarra española')]");
	}

	@Test
	public void PR19() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos con el campo vacío
		PO_PrivateView.fillSearchOffer(driver, "");

		// Hay 12 ofertas en total. 5 en la primera página
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tbody/tr");
		Assert.assertTrue(elementos.size() == 5);
		By enlace = By.xpath("//*[@id=\"pi-2\"]/a");
		driver.findElement(enlace).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		// Y 5 en la segunda
		Assert.assertTrue(elementos.size() == 5);

		enlace = By.xpath("//*[@id=\"pi-3\"]/a");
		driver.findElement(enlace).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		// Y 2 en la tercera
		Assert.assertTrue(elementos.size() == 2);
	}

	@Test
	public void PR20() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos un producto que no existe
		PO_PrivateView.fillSearchOffer(driver, "diplodocus");

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tr");
		// Un único resultado (la cabecera de la tabla, vacía)
		Assert.assertTrue(elementos.size() == 1);
	}

	@Test
	public void PR21() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos un producto que no existe
		PO_PrivateView.fillSearchOffer(driver, "UCRANIANO");

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tr");
		// Un único resultado más la cabecera de la tabla
		Assert.assertTrue(elementos.size() == 2);
	}

	@Test
	public void PR22() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos productos que tengan en su título "anillo"
		PO_PrivateView.fillSearchOffer(driver, "espada");
		List<WebElement> saldos = PO_View.checkElement(driver, "free", "//nav/div/div[2]/ul[3]/li[2]/span");
		double saldo = Double.valueOf(saldos.get(0).getText());
		Assert.assertTrue(saldo == 75.7);

		// Compramos un podructo de 20
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td/div/div/button");
		elementos.get(0).click();
		saldos = PO_View.checkElement(driver, "free", "//nav/div/div[2]/ul[3]/li[2]/span");
		saldo = Double.valueOf(saldos.get(0).getText());
		Assert.assertTrue(saldo == 75.7 - 45.0);
	}

	@Test
	public void PR23() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos productos que tengan en su título "anillo"
		PO_PrivateView.fillSearchOffer(driver, "cadillac");
		List<WebElement> saldos = PO_View.checkElement(driver, "free", "//nav/div/div[2]/ul[3]/li[2]/span");
		double saldo = Double.valueOf(saldos.get(0).getText());
		Assert.assertTrue(saldo == 75.7);

		// Compramos un productos que deja el contador a 0
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td/div/div/button");
		elementos.get(0).click();

		// El saldo pasa a ser 0
		saldos = PO_View.checkElement(driver, "free", "//nav/div/div[2]/ul[3]/li[2]/span");
		saldo = Double.valueOf(saldos.get(0).getText());
		Assert.assertTrue(saldo == 0);
	}

	@Test
	public void PR24() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de buscar ofertas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listothers')]", 0);

		// Buscamos productos que tengan en su título "anillo"
		PO_PrivateView.fillSearchOffer(driver, "relicario");
		List<WebElement> saldos = PO_View.checkElement(driver, "free", "//nav/div/div[2]/ul[3]/li[2]/span");
		double saldo = Double.valueOf(saldos.get(0).getText());
		Assert.assertTrue(saldo == 75.7);
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td/div/div/button");
		elementos.get(0).click();
		Assert.assertTrue(saldo == 75.7);
		PO_View.checkElement(driver, "text", "El saldo es insuficiente.");
	}

	@Test
	public void PR25() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		// Seleccionamos el menú del nav para comprar
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'purchases-menu')]/a", 0);
		// Y en ese menú la opción de listar las ofertas compradas
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listpurchases')]", 0);

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tbody/tr");
		Assert.assertTrue(elementos.size() == 2);
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Paraguas negro')]");
		PO_View.checkElement(driver, "free", "//td[contains(text(), 'Nokia 3000')]");

	}

	@Test
	public void PR26() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/add')]", 0);

		PO_View.checkElement(driver, "text", "75.7");

		PO_PrivateView.fillFormAddOffer(driver, "SR2 Normandy", "Modelo a escala de una nave mítica.", "134",
				"2018-11-05", true);
		SeleniumUtils.EsperaCargaPagina(driver, "text", "SR2 Normandy", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPagina(driver, "text", "55.7", PO_View.getTimeout());

		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "helsreach@yahoo.es", "123456");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "helsreach@yahoo.es", PO_View.getTimeout());

		PO_View.checkElement(driver, "text", "Ofertas destacadas");

		PO_View.checkElement(driver, "text", "SR2 Normandy");
	}

	@Test
	public void PR27() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");

		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listown')]", 0);

		PO_View.checkElement(driver, "text", "75.7");

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'La Divina Comedia')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "55.7", PO_View.getTimeout());

		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "helsreach@yahoo.es", "123456");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "helsreach@yahoo.es", PO_View.getTimeout());

		PO_View.checkElement(driver, "text", "Ofertas destacadas");

		SeleniumUtils.EsperaCargaPagina(driver, "text", "La Divina Comedia", PO_View.getTimeout());

		PO_View.checkElement(driver, "text", "La Divina Comedia");
	}

	@Test
	public void PR28() {
		// Vamos al formulario de logueo.
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "text", "cruzadaeterna@gmail.com");
		PO_PrivateView.getElementsAndClick(driver, "//li[contains(@id,  'offers-menu')]/a", 0);
		PO_PrivateView.getElementsAndClick(driver, "//a[contains(@href, 'offer/listown')]", 0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "75.7", PO_View.getTimeout());

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'La Divina Comedia')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "55.7", PO_View.getTimeout());

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'TES III: Morrowind')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "35.7", PO_View.getTimeout());

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'Guitarra española')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "15.7", PO_View.getTimeout());

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'TES III: Morrowind')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);
		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'La Divina Comedia')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);
		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'Guitarra española')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		PO_PrivateView.getElementsAndClick(driver,
				"//td[contains(text(), 'La Divina Comedia')]/following-sibling::*/div/div/button[contains(@class, 'btndes')]",
				0);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "El saldo es insuficiente.", PO_View.getTimeout());

		PO_View.checkElement(driver, "text", "15.7");

	}

	@Test
	public void PR29() {
		driver.navigate().to(URL + "cliente.html");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");
	}

	@Test
	public void PR30() {
		// Vamos al formulario de logueo.
		driver.navigate().to(URL + "cliente.html");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "armaggeddon");
		PO_View.checkElement(driver, "id", "boton-login");
	}

	@Test
	public void PR31() {
		// Vamos al formulario de logueo.
		driver.navigate().to(URL + "cliente.html");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "", "kjdasjkf");
		PO_View.checkElement(driver, "id", "boton-login");

		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "");
		PO_View.checkElement(driver, "id", "boton-login");
	}

	@Test
	public void PR32() {
		driver.navigate().to(URL + "cliente.html");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		List<WebElement> filas = PO_View.checkElement(driver, "class", "tdemail");
		// Hay 3 ofertas por usuario, 15 en total. No se muestran las 3 del actual, ergo
		// 12
		Assert.assertEquals(filas.size(), 12);
		// Aparecen los emails de todos los usuarios
		SeleniumUtils.EsperaCargaPagina(driver, "text", "CENSURADO PARA DESCLASIFICACIÓN@uniovi.es", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPagina(driver, "text", "armaggedon41@hotmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPagina(driver, "text", "helsreach@yahoo.es", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPagina(driver, "text", "alpha-legion@gmail.com", PO_View.getTimeout());
		// El actual aparece en la parte superior
		SeleniumUtils.EsperaCargaPagina(driver, "text", "cruzadaeterna@gmail.com", PO_View.getTimeout());
		// Su oferta no aparece
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "La Divina Comedia", PO_View.getTimeout());
	}

	@Test
	public void PR33() {
		driver.navigate().to(URL + "cliente.html");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		PO_HomeView.clickOptionByClass(driver, "en-Relicario", "text", "Chat con helsreach@yahoo.es sobre Relicario");

		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Yo", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Muy buenas caballero, su propuesta pareceme harto interesante",
				PO_View.getTimeout());

		WebElement message = driver.findElement(By.name("messageText"));
		message.click();
		message.clear();
		message.sendKeys("Muy buenas caballero, su propuesta pareceme harto interesante");

		WebElement btn = driver.findElement(By.id("boton-chat"));
		btn.click();

		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Creando chat...", 8000);
		List<WebElement> filas = PO_View.checkElement(driver, "free", "//tr");
		Assert.assertEquals(filas.size(), 1);
		List<WebElement> columnas = PO_View.checkElement(driver, "free", "//td");
		Assert.assertEquals(columnas.size(), 3);

		SeleniumUtils.EsperaCargaPagina(driver, "text", "Yo", PO_View.getTimeout());

	}

	@Test
	public void PR34() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Entramos en la primera del listado
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[1]/td[4]/a", 0);
		PO_View.checkElement(driver, "id", "titulochat");

		SeleniumUtils.EsperaCargaPagina(driver, "text", "La quiero comprar", 4000);
		// Enviamos el comentario
		PO_PrivateView.fillNewComment(driver, "Pues glorioso me parece");
		// Y comrprobamos que está en la lista de mensajes
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Pues glorioso me parece", 4000);
	}

	@Test
	public void PR35() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Comprobamos que hay el número de chats adecuados
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//tbody/tr");
		Assert.assertTrue(elementos.size() == 6);

		// Y ques esos elementos son los adecuados
		PO_View.checkElement(driver, "text", "La Comunidad del Anillo");
		PO_View.checkElement(driver, "text", "La Divina Comedia");
		PO_View.checkElement(driver, "text", "TES III: Morrowind");
		PO_View.checkElement(driver, "text", "Guitarra española");
		PO_View.checkElement(driver, "text", "BMW 320i");
		PO_View.checkElement(driver, "text", "Espada toledana");

	}

	@Test
	public void PR36() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Borramos el chat
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "/html/body/div/div/table/tbody/tr[1]/td[2]");
		String ofertaChatBorrado = elementos.get(0).getText();

		// El chat no está
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[1]/td[5]/a", 0);
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, ofertaChatBorrado, PO_View.getTimeout());

		// Y hay uno menos que antes
		elementos = PO_View.checkElement(driver, "free", "//tbody/tr");
		// Comprobamos que hay el número de chats adecuados
		Assert.assertTrue(elementos.size() == 5);
	}

	@Test
	public void PR37() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Borramos el chat
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "/html/body/div/div/table/tbody/tr[6]/td[2]");
		String ofertaChatBorrado = elementos.get(0).getText();

		// El chat no está
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[6]/td[5]/a", 0);
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, ofertaChatBorrado, PO_View.getTimeout());

		// Y hay uno menos que antes
		elementos = PO_View.checkElement(driver, "free", "//tbody/tr");
		// Comprobamos que hay el número de chats adecuados
		Assert.assertTrue(elementos.size() == 5);
	}
	
	@Test
	public void PR38() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Y empezamos una conversación sobre la oferta
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[3]/td[5]/a", 0);

		// Enviamos los comentarios
		// Y comrprobamos que están en la lista de mensajes
		PO_PrivateView.fillNewComment(driver, "Espero que este todo correcto");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Creando chat...", 8000);
		PO_View.checkElement(driver, "text", "Espero que este todo correcto");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Leído", 2000);

		// Ahora entramos con el dueño de la oferta
		driver.navigate().to(URL + "cliente.html?w=login");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "alpha-legion@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Y el número de mensajes sin leer es el adecuado, 1
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "/html/body/div/div/table/tbody/tr[2]/td[3]");
		String mensajesNoLeidos = elementos.get(0).getText();
		Assert.assertTrue(Integer.valueOf(mensajesNoLeidos) == 1);
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[2]/td[4]", 0);
		
		
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Espero que este todo correcto", 4000);
		SeleniumUtils.EsperaCargaPagina(driver, "text", "cruzadaeterna@gmail.com", 4000);
		
		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Y abrimos la conversación sobre la oferta
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[3]/td[5]/a", 0);
		
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Espero que este todo correcto", 4000);
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Leído", 4000);
	}

	@Test
	public void PR39() {
		// Reseteo completo
		driver.navigate().to("https://localhost:8080/resetdb");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Reseteo de la base de datos completado con éxito", 90000);

		driver.navigate().to(URL + "cliente.html?w=login");
		// Rellenamos el formulario
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "cruzadaeterna@gmail.com", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Y empezamos una conversación sobre la oferta "Gaita asturiana"
		PO_PrivateView.getElementsAndClick(driver, "/html/body/div/div/table/tbody/tr[5]/td[5]/a", 0);

		// Enviamos los comentarios
		// Y comrprobamos que están en la lista de mensajes
		PO_PrivateView.fillNewComment(driver, "do");
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Creando chat...", 8000);
		SeleniumUtils.EsperaCargaPagina(driver, "text", "do", 2000);
		PO_PrivateView.fillNewComment(driver, "re");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "re", 2000);
		PO_PrivateView.fillNewComment(driver, "mi");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "mi", 2000);

		// Ahora entramos con el dueño de la oferta
		driver.navigate().to(URL + "cliente.html?w=login");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Email:", 4000);
		PO_LoginView.fillForm(driver, "helsreach@yahoo.es", "123456");
		PO_View.checkElement(driver, "id", "tableOffers");

		// Vamos a la sección de listado de conversaciones
		driver.navigate().to(URL + "cliente.html?w=chats");
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Contactar", 4000);

		// Y el número de mensajes sin leer es el adecuado, 3
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "/html/body/div/div/table/tbody/tr[2]/td[3]");
		String mensajesNoLeidos = elementos.get(0).getText();
		Assert.assertTrue(Integer.valueOf(mensajesNoLeidos) == 3);
	}

}
