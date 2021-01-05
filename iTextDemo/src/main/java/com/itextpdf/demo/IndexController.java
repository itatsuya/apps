package com.itextpdf.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/*
 * トップ画面のコントローラ
 */
@Controller
public class IndexController {

    @GetMapping("/index")
    public String main(Model model)
    {
        return "index";
    }

}