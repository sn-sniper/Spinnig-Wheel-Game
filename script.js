const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// Values 1 to 10 in random order
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
shuffleArray(values);

//Object that stores values of minimum and maximum angle for a value
const rotationValues = values.map((value, index) => {
    const minDegree = index * 36;
    const maxDegree = minDegree + 35;
    return { minDegree, maxDegree, value };
});

//Size of each piece
const data = Array(10).fill(10);

//Background color for each piece
var pieColors = [
    "#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc",
    "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da",
];

//Create chart
let myChart = new Chart(wheel, {
    //Plugin for displaying text on pie chart
    plugins: [ChartDataLabels],
    //Chart Type Pie
    type: "pie",
    data: {
        //Labels (values which are to be displayed on chart)
        labels: values,
        //Settings for dataset/pie
        datasets: [
            {
                backgroundColor: pieColors,
                data: data,
            },
        ],
    },
    options: {
        //Responsive chart
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            //Hide tooltip and legend
            tooltip: false,
            legend: {
                display: false,
            },
            //Display labels inside pie chart
            datalabels: {
                color: "#ffffff",
                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                font: { size: 24 },
            },
        },
    },
});

//Display value based on the randomAngle
const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
        //If the angleValue is between min and max then display it
        if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
            finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
            spinBtn.disabled = false;
            break;
        }
    }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;

//Start spinning
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    //Empty final value
    finalValue.innerHTML = `<p>Good Luck!</p>`;
    //Generate random degrees to stop at
    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
    //Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        //Set rotation for piechart
        /*
        Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
        */
        myChart.options.rotation = myChart.options.rotation + resultValue;
        //Update chart with new value;
        myChart.update();
        //If rotation>360 reset it back to 0
        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    }, 10);
});
