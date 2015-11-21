var res = {
    HelloWorld_png : "res/HelloWorld.png",
    Board_png : "res/Board.png",
    PlaceBoard_png: "res/PlaceBoard.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    Youwin_png : "res/You-Win.png",	
    Piece1_png: "res/simpleblock4.png",
    Piece2_png: "res/simpleblock.png",
    Piece3_png: "res/simpleblock2.png",
    Piece4_png: "res/simpleblock3.png",
    Background_png: "res/background.png",
    GameBackground_png: "res/gamebackground.png",
    Play_m1_png: "res/classic.png", //#ffdc77, #644c00
    Play_m1_clicked_png: "res/classic_clicked.png",
    Play_m2_png: "res/trick.png", //#ffdc77, #644c00
    Play_m2_clicked_png: "res/trick_clicked.png",
    Play_m3_png: "res/double.png", //#ffdc77, #644c00
    Play_m3_clicked_png: "res/double_clicked.png",
    ViewScores_png: "res/view_scores.png",
    ViewScores_clicked_png: "res/view_scores_clicked.png",
    ViewAchievements_png: "res/view_achievements.png",
    ViewAchievements_clicked_png: "res/view_achievements_clicked.png",
    Back_png: "res/back.png",
    Back_clicked_png: "res/back_clicked.png",
    Quit_png: "res/quit.png",
    Quit_clicked_png: "res/quit_clicked.png",
    Level_png: "res/lvl.png",
    Level_clicked_png: "res/lvl_clicked.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}