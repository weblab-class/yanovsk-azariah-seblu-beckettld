import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import Card from "react-bootstrap/Card";
import Map from "../assets/tile4.gif";
import { sprites, maps } from "./data.js";
import AnimatedText from "react-animated-text-content";

const ChooseMap = () => {
  const socket = useContext(SocketContext);
  const [mapSelection, setMapSelection] = useState(false);
  const [spriteSelection, setSpriteSelection] = useState(false);
  const [spriteName, setSpriteName] = useState("");
  const [mapName, setMapName] = useState("");
  const [submissionMade, setSubmissionMade] = useState(false);

  //something like create new game
  const handleMapSelection = (map_id, map_name) => {
    setMapSelection(map_id);
    setMapName(map_name);
  };

  const handleSpriteSelection = (sprite_id, spriteName) => {
    setSpriteSelection(sprite_id);
    setSpriteName(spriteName);
  };

  const handleSubmitSelections = (map_id, map_name) => {
    setSubmissionMade(true);
    if (map_id === 99) {
      random_num = Math.floor(Math.random() * 6);
      socket.emit("initGameState", { random_num, spriteSelection });
    } else {
      socket.emit("initGameState", { mapSelection, spriteSelection });
    }
  };
  return (
    <div className="nes-container is-rounded is-dark">
      {mapSelection ? "Selected: " + mapName + " map" : "Make a Map Selection"}
      <br /> <br />
      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            src={maps[0]}
            onClick={() => handleMapSelection(1, "Farm")}
          />
          <Card.Title class="nes-text is-success">Farm</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(2, "Tropics")} />
          <Card.Title class="nes-text is-success">Tropics</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(3, "Desert")} />
          <Card.Title class="nes-text is-warning">Desert</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(4, "Winter")} />
          <Card.Title class="nes-text is-warning">Winter</Card.Title>
        </Card>
      </div>
      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img src={Map} onClick={() => handleMapSelection(5, "Poison")} />
          <Card.Title class="nes-text is-error">Poison</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(6, "Lava")} />
          <Card.Title class="nes-text is-error">Lava</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(7, "Random")} />
          <Card.Title class="nes-text is-disabled">Random</Card.Title>
        </Card>
      </div>
      <br />
      {spriteSelection ? "Selected: " + spriteName : "Make a Sprite Selection"}
      <br />
      <br />
      <div className="map_tiles_wrapper">
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[0]}
            onClick={() => handleSpriteSelection(1, "Block Man")}
          />
          <Card.Title>Block</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[1]}
            onClick={() => handleSpriteSelection(2, "Burst Man")}
          />
          <Card.Title>Burst</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[2]}
            onClick={() => handleSpriteSelection(3, "Elec Man")}
          />
          <Card.Title>Elec</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[3]}
            onClick={() => handleSpriteSelection(4, "Heat Man")}
          />
          <Card.Title>Heat</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[4]}
            onClick={() => handleSpriteSelection(5, "Plant Man")}
          />
          <Card.Title>Plant</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[5]}
            onClick={() => handleSpriteSelection(6, "Mega Man")}
          />
          <Card.Title>Mega</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[7]}
            onClick={() => handleSpriteSelection(7, "Pharaoh")}
          />
          <Card.Title>Pharaoh</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[6]}
            onClick={() => handleSpriteSelection(8, "Spring Man")}
          />
          <Card.Title>Spring</Card.Title>
        </Card>
      </div>
      <>
        <br />
        {mapSelection && spriteSelection ? (
          <>
            {submissionMade ? (
              "Submission made. Waiting for another player"
            ) : (
              <button onClick={handleSubmitSelections}>Submit Selections</button>
            )}
          </>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default ChooseMap;
