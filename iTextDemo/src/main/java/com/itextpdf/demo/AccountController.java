package com.itextpdf.demo;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/*
 * 情報入力画面のコントローラ
 */
@Controller
public class AccountController {

    public static final String OUTPUT_FILE_NAME = "download-dir/result.pdf";

    @GetMapping("/accountDetails")
    public String main(Model model)
    {
        return "accountDetails";
    }

    @PostMapping("/downDetails")
    public String down(@ModelAttribute InputData inputData, HttpServletRequest request, HttpServletResponse response) throws Exception
    {
    	File file = new File(OUTPUT_FILE_NAME);
        file.getParentFile().mkdirs();
        new PdfCreator().createPdf(inputData, OUTPUT_FILE_NAME);
        response.setContentType("application/download; charset=utf-8");
        response.setContentLength((int)file.length());

        String fileName = URLEncoder.encode(file.getName(), "utf-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\";");
        response.setHeader("Content-Transfer-Encoding", "binary");

        try(OutputStream out = response.getOutputStream()) {
            try(FileInputStream fis = new FileInputStream(file)) {
                FileCopyUtils.copy(fis, out);
            }
        }

        return "accountDetails";
    }

}