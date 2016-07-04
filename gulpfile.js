/**
 * Created by jerry on 16/5/21.
 */


var gulp = require("gulp");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var htmlMin = require("gulp-htmlmin");

/**
 * 压缩 CSS文件
 */
gulp.task("cleanCss", function(){

    gulp.src("public/**/*.css")
        .pipe(cleanCSS())
        .pipe(gulp.dest(".", {
            "cwd": "public"
        }));
});


/**
 * 压缩 JS 文件
 */
gulp.task("uglify", function(){

    gulp.src("public/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(".", {
            "cwd": "public"
        }));

});


/**
 * 压缩 HTML
 */
gulp.task("htmlMin", function(){

    gulp.src("public/**/*.html")
        .pipe(htmlMin({
            "collapseWhitespace": true,
            "minifyJS": true   // 同时压缩 JS
        }))
        .pipe(gulp.dest(".", {
            "cwd": "public"
        }));

});


/**
 * 构建整个项目
 */
gulp.task("build", ["cleanCss", "uglify", "htmlMin"]);


/**
 *
 */
gulp.task("default", function(){

    console.log("Use `gulp build`");

});


gulp.task("test", function(){

    var Hexo = require("hexo");
    var hexo = new Hexo(process.cwd(), {});

    // 初始化
    hexo.init().then(function(){
        console.log("hexo init");

        // 清理旧文件
        hexo.call("clean", {}).then(function(){
            console.log("clean up");

            // 生成新文件
            hexo.call("generate", {}).then(function(){

                console.log("generate OK");

                // 执行 gulp 任务
                gulp.run(["cleanCss", "uglify", "htmlMin"]);

                return hexo.exit();

            });

        });

    });

});