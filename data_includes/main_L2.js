// ========================================================
// === IBEX exp. Chao Sun, last update: 15.05.2020 (JW) ===
// ========================================================
// Prerequired commands
PennController.ResetPrefix(null);  // setting prefix to zero
PennController.AddHost("http://amor.cms.hu-berlin.de/~sunchaox/");   // adding a source for stimuli and files
PennController.DebugOff();
//
//
//
//
//
//
//
//
//
//
// =========== The Experiment ================
// I. A PennController Sequence to organize the order of Presentation
PennController.Sequence( "hello", "preloadTrial","consent", "soundcheck", "demographics", "explain", randomize("trial") , "send" , "final" )
//
//
//
//
// II. The Controller(s)
// 1. Welcomming Participant and asking for ID
    PennController("hello"
        ,
        
        // Create HTML element from Form uploaded to "chunk_includes" section
        newHtml("hi", "hello.html")
            .print()
            .log()
        ,
        
        // get HTML element, which includes printing it
        getHtml("hi")
        ,
        
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        newVar("ID")
            .global()
            .set( v=>Date.now() )
        ,
        // new Button, will wait until the regex in "getTextInput("ID").test.text(regex)" matches the Input from TextInput "ID" - for now, a 24 long string of "word characters" is necessary
        newButton("fortfahren")
            .center()
            .print()
            .wait()
    )
    .log("ID", getVar("ID"))
    .setOption("countsForProgressBar", false) // this section will not be counted in the progress bar
    .setOption("hideProgressBar", true) // progress bar hidden during this controller.
    .noHeader()
    ;
//
//
//
//
// 2. Information and Consent
    PennController("consent",
        newHtml("consent", "consent.html")
            .checkboxWarning("Bitte setze ein Häckchen bei '%name%', um fortzufahren!")
            .log()
            .print()
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,    
        newButton("fortfahren", "fortfahren")
            .center()
            .print()
            .wait(
                getHtml("consent").test.complete()
                    .failure( getHtml("consent").warn() )
                )   
    
    )
    .log("ID", getVar("ID"))
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .noHeader()
    ;
//
//
//
//
// 3. Sound check
    PennController("soundcheck"
        ,
        // 1.1. Create HTML element from Form uploaded to "chunk_includes" section
        newHtml("soundcheck", "soundcheck.html")
            .print()
            .log()
        ,
        // 1.2. get Html element, which includes printing it
        getHtml("soundcheck")
        ,
        // 2. Audio Element to be played    
        newAudio("test", "http://amor.cms.hu-berlin.de/~sunchaox/die_Banane.wav")
            .print()
            .wait()
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        newTextInput("check")
            .log()
            .print()
            .length(20)
            .before(newText("Was hast du gehört? "))
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()        
        ,
        // continue after successfully entering "die Banane" (with or without "die". flexible use of white space, no capitalization needed)
        newButton("fortfahren")
            .print()
            .center()
            .wait(
                getTextInput("check").test.text(/\s?[bB](anane)\s?/)
                    .failure(
                        newText("<br>Bitte trage ein, was du beim Abspielen der Sounddatei hörst!<br> Wenn du zur Zeit keine Audiodatein abspielen kannst,<br>kehre einfach später zum Experiment zurück.")
                            .color("red")
                            .print()
                            )
                 )
    )
    .log("ID", getVar("ID"))
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .noHeader()
    ;
//
//
//
//
// 4. Collecting demographic data

    PennController("demographics"
        ,    
        newHtml("demographics", "demographics.html")
            .checkboxWarning("Bitte setze ein Häckchen bei '%name%', um fortzufahren!")
            .inputWarning("Bitte trage etwas in das Feld '%name%' ein, um fortzufahren!")
            .radioWarning("Bitte setze deine Auswahl im Feld '%name%', um fortzufahren!")
            .print()
            .log()
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,    
        newButton("fortfahren", "fortfahren")
            .center()
            .print()
            .wait(
                getHtml("demographics").test.complete()
                    .failure( getHtml("demographics").warn() )
                )
    )
    .log("ID", getVar("ID"))  // ensuring to collect ID
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .noHeader()
    ;
//
//
//
//
// 5. Procedure explained
    PennController("explain"
        ,
        newHtml("howto", "howto.html")
            .print()
            .log()
        ,
        getHtml("howto")
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        newButton("starten")
            .log()
            .center()
            .print()
            .wait()   
    )
    .log("ID", getVar("ID"))  // ensuring to collect ID
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    ;
//
//
//
//    
// 6. Trial events
    PennController.Template( PennController.GetTable("list2.csv"),   // creates a template to be used for multiple trials; will use .csv in chunk_includes
        variable =>
        PennController("trial"
            ,
            newTimer("wait1", 500)
                .start()
                .wait()
            ,
            newImage("one", variable.image)
                .settings.size(250,250)
                .print()
            ,
            newAudio("context1", variable.context1_file)  // italics
                .play()
                .wait()
                .remove()
            ,
            newAudio("context2", variable.context2_file)  // italics
                .play()
                .wait()
                .remove()
            ,
            newAudio("utterance", variable.utterance_file)  // italics
                .play()
                .wait()
                .remove()
            ,
            newCanvas("tanks", 350, 350)
                .settings.add(   50, 50, getImage("one") )
                .print()
            ,
            getImage("one")
                .remove()
            ,
            newText("question",variable.question)
                .print()
            ,
            getText("question")
                .test.text( "" )
                .success(newTimer("wait2", 500)
                .start()
                .wait()
            ,
            getAudio("utterance")
                .wait("first")
            )
                .failure(
                    newButton("yes", "Ja")         // a button with the word 'start'; DP
                        .print()
                    ,
                    newButton("no", "Nein") // a button with the word 'start'; DP
                        .print()
                    ,
                    newButton("notsure","nicht sicher") // a button with the word 'start'; DP
                        .print()
                    ,
                    newCanvas("compQ", 400, 250)
                        .settings.add(   50, 50, getText("question") )
                        .settings.add(   50, 150, getButton("yes") )
                        .settings.add(   200, 150, getButton("no") )
                        .settings.add(   350, 150, getButton("notsure") )
                        .print()
                    ,
                    newSelector()
                        .settings.add( getButton("yes") , getButton("no") ,getButton("notsure"))
                        .settings.log()
                        .settings.once() // Task 4
                        .wait()
                    ,
                    getAudio("utterance")
                        .wait("first")
                    )
    )
    .log("ItemID", variable.Item)
    .log("List", variable.list)
    .log("Condition", variable.condition)
    .log( "ID" , getVar("ID")) // ensures that for each trial, logging value of ID in variable ID; this should be OUTSIDE of PennController()
    );
//
//
//
//
// 7. Send results
    PennController.SendResults( "send" ); // important!!! Sends all results to the server
//
//
//
//
// 8. Thank you screen
PennController( "final" ,
                newHtml("bye", "end_screen_L2.html")
                    .print()
                    .log()
                ,
                getHtml("bye")
                ,
                newButton("void") // invisible button "void" = dead end
                    .wait() // 
               )
               .log()
               .setOption("countsForProgressBar", false)
               .setOption("hideProgressBar", true);