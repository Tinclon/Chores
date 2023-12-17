const personMultipliers = // People;
    {
    };
const choreValues = // Chores;
    {
    };
const yuckyChores = // YuckyChores;
    {
        "🥗": "",
    };
const noteText = // "ChoreText";
    "Family Chores~😼~🍽~🟡~🪟";

const rightAlign = (text, width) => `${
    text.match(/1/)?.reduce(acc => acc + "  ", "") ?? ""}${
    (" ".repeat(width) + text).match(`(.{${width}}$)`)[0]
}`

const calculate = () => {
    const unknownEmoji = noteText
        .replace(/Family Chores/g, "")
        .replace(/~/g, "")
        .replace(new RegExp(Object.keys(personMultipliers).join("|"), 'gu'), "")
        .replace(new RegExp(Object.keys(choreValues).join("|"), 'gu'), "")
    if (unknownEmoji) {
        console.error(`
⚠️⚠️⚠️ CRISIS ⚠️⚠️⚠️

The following emoji are not recognized: 
${unknownEmoji}

Go see 🟡 to have this horrible situation amended.

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
        `)
        return;
    }

    const result = {};
    noteText.split("~").forEach((persons, index, choreText) => {
        if (++index % 2) return;
        const chores = choreText[index]
            .match(new RegExp(Object.keys(choreValues).join("|"), 'gu'));
        const score = chores
            .reduce((acc, chore) => acc + choreValues[chore], 0);
        [...persons].forEach(person => {
            result[person] = result[person] || {
                multiplier: personMultipliers[person],
                count: 0,
                score: 0,
                yuckyChores: ""
            };
            result[person].score += score;
            result[person].count += chores.length;
            Object.keys(yuckyChores)
                .filter(yuckyChore => chores.includes(yuckyChore))
                .forEach(yuckyChore => yuckyChores[yuckyChore] = person)
        });
    });
    Object.entries(yuckyChores).forEach(([yuckyChore, person]) =>
        person && (result[person].yuckyChores += yuckyChore));
    Object.keys(result).forEach(person => {
        result[person].score = Math.ceil(result[person].score * result[person].multiplier);
        result[person].rightAlignedCount = rightAlign(`${result[person].count}`, 6);
        result[person].rightAlignedScore = rightAlign(`${result[person].score}`, 8);
        result[person].rightAlignedYucky = rightAlign(`${result[person].yuckyChores}`, 8);
    });

    return `
┏━━┳━━━━┳━━━━━┳━━━━┓
    \t👤\t\t  🧮\t\t   ⌛️\t\t\t🕘
    
    ${Object.entries(result)
        .sort(([, r1v], [, r2v]) => r1v.multiplier - r2v.multiplier)
        .reduce((acc, [person]) =>
            (acc.push(`\t${person}\t${result[person].rightAlignedCount}\t${result[person].rightAlignedScore}\t${result[person].rightAlignedYucky}`), acc), []
        ).join("\n")}
 ┗━━┻━━━━┻━━━━━┻━━━━┛
`;
}

return calculate();
