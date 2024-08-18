const ChangeColor = () => {
  return (
    <div className="menu">
      <div id="p1">
        <input type="color" name="head" value="#0095DD" />
        <label for="head">
          <p>player 1</p>
        </label>
      </div>
      <div id="p2" >
        <label for="body">
          <p>player 2</p>
        </label>
        <input type="color" name="body" value="#f6b73c" />
      </div>
      {/* <div className="rangeP1">
        <input type="range" />
        <input type="range" />
      </div>
      <div className="rangeP2">
        <input type="range" />
        <input type="range" />
      </div> */}
    </div>
  )
}

export default ChangeColor