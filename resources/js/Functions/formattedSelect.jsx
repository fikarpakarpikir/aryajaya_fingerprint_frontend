import capitalizeFirstLetter from "./textual";

export default function formattedSelect(data, key) {
    const formattedArray = data.map((item) => ({
        value: item.id.toString(),
        label: capitalizeFirstLetter(item[key]),
    }));

    //   console.log(formattedArray);
    return formattedArray;
}
