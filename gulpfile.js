"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const dist = "./dist/";

gulp.task("copy-html", () => {
  return gulp
    .src("./src/index.html")
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

gulp.task("server", function () {
  browserSync({
    server: {
      baseDir: "src",
    },
  });

  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function () {
  return gulp
    .src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task("copy-img", () => {
  return gulp
    .src("./src/img/**/*.*")
    .pipe(gulp.dest(dist + "/img"))
    .on("end", browserSync.reload);
});

gulp.task("copy-css", () => {
  return gulp
    .src("./src/css/**/*.*")
    .pipe(gulp.dest(dist + "/css"))
    .on("end", browserSync.reload);
});

gulp.task("build-js", () => {
  return gulp
    .src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.js",
        },
        watch: false,
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        debug: true,
                        corejs: 3,
                        useBuiltIns: "usage",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist))
    .on("end", browserSync.reload);
});

gulp.task("watch", () => {
  browserSync.init({
    server: "./dist/",
    port: 4000,
    notify: true,
  });

  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/img/**/*.*", gulp.parallel("copy-img"));
  gulp.watch("./src/css/**/*.*", gulp.parallel("copy-css"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
});
//

gulp.task(
  "build",
  gulp.parallel("copy-html", "copy-img", "copy-css", "styles", "build-js")
);

gulp.task("build-prod-js", () => {
  return gulp
    .src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "production",
        output: {
          filename: "script.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        corejs: 3,
                        useBuiltIns: "usage",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));
// gulp.task("default", gulp.parallel("watch", "server", "styles"));
