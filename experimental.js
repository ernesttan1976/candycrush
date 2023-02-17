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
//
//
//
//
//
// This below section is some widgets for experimentation, not part of this game

function experimental() {
    const preview = document.querySelector("#preview");
    const box = document.querySelector("#div1");
    //console.log("box: " + box);
    box.addEventListener("dragover", onDragOverHandler2);
    box.addEventListener("drop", onDropHandler2);
  
    const item = document.querySelector("#img1");
    //console.log(`item: ${item}`);
    item.addEventListener("dragstart", onDragStartHandler2);
    //ITEM
    //on drag, save the element data , in this case it is the id
    function onDragStartHandler2(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
      console.log("onDragStartHandler: setData", ev.target.id);
    }
  
    //BOX
    //ondragover, prevent the default
    function onDragOverHandler2(ev) {
      ev.preventDefault();
      console.log("onDragOverHandler");
    }
  
    //BOX
    function onDropHandler2(ev) {
      ev.preventDefault();
      console.dir(ev.dataTransfer);
      console.log(`types: ${ev.dataTransfer.types}`);
      console.dir(ev.dataTransfer.types[0]);
      console.dir(ev.dataTransfer.getData(ev.dataTransfer.types[0]));
      //   console.dir(ev.dataTransfer.getData("text"));
      //   console.dir(ev.dataTransfer.getData("Files"));
  
      if (ev.dataTransfer.types[0].includes("text")) {
        var data = ev.dataTransfer.getData("text");
        console.log("data:", data);
  
        ev.target.appendChild(document.getElementById(data));
        console.log(`drop: data:${data} ev.target ${ev.target}`);
      } else if (ev.dataTransfer.types[0].includes("Files")) {
        console.log("files");
  
        if (ev.dataTransfer.items) {
          //either it is a mixture of items or it is files
          console.log("items detected");
          handleImages(ev.dataTransfer.files, preview);
          [...ev.dataTransfer.items].forEach((file, i) => {
            console.log(`file no. ${i}, webkitRelativePath ${file.webkitRelativePath}
              file.name ${file.name}, file.type ${file.type}, file.size ${file.size}`);
            console.dir(file);
            console.log(file.getAsFile());
          });
        } else {
          //it is files
          //convert collection to array
          console.log("files detected");
        }
      }
    }
  
    function handleImages(files, preview) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
  
        if (!file.type.startsWith("image/")) {
          continue;
        }
  
        const img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
  
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    console.log("started");
  
  
  
  }
  
  //experimental();
  