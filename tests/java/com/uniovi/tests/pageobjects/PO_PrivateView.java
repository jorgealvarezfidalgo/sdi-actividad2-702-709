package com.uniovi.tests.pageobjects;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_PrivateView extends PO_NavView {
	
	static public void fillFormAddOffer(WebDriver driver, String titlep,  String descriptionp,
			String costp, String datep, boolean destacadap)   {             
		//Esperamos 5 segundo a que carge el DOM porque en algunos equipos falla            
		SeleniumUtils.esperarSegundos(driver, 5);                
		//Rellenemos el campo de descripci�n      
		WebElement title = driver.findElement(By.name("title"));    
		title.clear();    
		title.sendKeys(titlep);
		WebElement description = driver.findElement(By.name("description"));    
		description.clear();    
		description.sendKeys(descriptionp);   
		WebElement cost = driver.findElement(By.name("cost"));    
		cost.clear();    
		cost.sendKeys(costp);   
		WebElement destacada = driver.findElement(By.name("destacada")); 
		if(destacadap)
			destacada.click();
		By boton = By.className("btn");    
		driver.findElement(boton).click();    
	}
	
	static public void getElementsAndClick(WebDriver driver, String path, int element) {
		List<WebElement>  elementos = PO_View.checkElement(driver, "free", path); 
		elementos.get(element).click();
	}
	
	static public void fillSearchOffer(WebDriver driver, String searchText) {
		WebElement searchField = driver.findElement(By.className("form-control"));
		searchField.clear();
		searchField.sendKeys(searchText);
		By boton = By.className("btn");    
		driver.findElement(boton).click();
	}
	
	static public void fillNewComment(WebDriver driver, String content) {
		SeleniumUtils.EsperaCargaPagina(driver, "text", "Enviar", 10000);
		WebElement commentField = driver.findElement(By.id("message"));
		commentField.clear();
		commentField.sendKeys(content);
		getElementsAndClick(driver, "//*[@id=\"boton-chat\"]", 0);
	}
}