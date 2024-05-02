<script>
    export let size = 200;
    export let percent = 0;
    export let bgColor = '#ffff00';
    export let fgColor = '#0080ff';
    export let testx = 0;
    export let testy = 0;
    export let style = "white";
    export let opacity = 0.5;

    export let datapoints = [];

    
    // $: viewBox = `0 0 ${size} ${size}`;
    
    $: radius = size;
    $: halfCircumference = Math.PI * radius;
    $: pieSize = halfCircumference * (percent / 100);
    $: dashArray = `0 ${halfCircumference - pieSize} ${pieSize}`;
    $: opacity = 0.5;
</script>
  
<circle
    r={radius} 
    cx={testx} 
    cy={testy} 
    fill={bgColor}
    opacity={opacity}
    />

<circle
    r={radius / 2}
    cx={testx}
    cy={testy}
    fill={bgColor}
    fill-opacity=0
    stroke={fgColor}
    stroke-width={radius}
    stroke-dasharray={dashArray}
    opacity={opacity}
    />
