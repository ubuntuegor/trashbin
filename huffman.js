function stripSymbols(string) {
    return string.replace(/[^A-zА-я0-9ё]/g, '').toLocaleLowerCase()
}

function countChars(string) {
    let count = {}

    for (let letter of string) {
        if (count[letter] === undefined)
            count[letter] = 0
        count[letter]++
    }

    return count
}

function getBinCodesRecursive(tree, prefix, codes) {
    if (!Array.isArray(tree))
        codes[tree] = prefix
    else {
        getBinCodesRecursive(tree[0], prefix + '0', codes)
        getBinCodesRecursive(tree[1], prefix + '1', codes)
    }
}

function getBinCodes(tree) {
    if (!Array.isArray(tree[0]))
        return { [tree[0]]: '0' }
    let codes = {}
    getBinCodesRecursive(tree[0], '', codes)
    return codes
}

class Queue {
    constructor() {
        this.array = []
    }

    get length() {
        return this.array.length
    }

    pushElement(element, weight) {
        let i
        for (i = 0; i < this.length; i++) {
            if (this.array[i].weight > weight)
                break
        }
        this.array.splice(i, 0, {
            element,
            weight
        })
    }

    popElement() {
        return this.array.shift()
    }
}

function encode(string, codes) {
    return string.replace(/(.)/g, match => codes[match])
}

function buildTree(input) {
    let count = countChars(input)
    let queue = new Queue()

    for (let letter in count)
        queue.pushElement(letter, count[letter])

    while (queue.length > 1) {
        let { element: elem1, weight: weight1 } = queue.popElement()
        let { element: elem2, weight: weight2 } = queue.popElement()

        queue.pushElement([elem1, elem2], weight1 + weight2)
    }

    let tree = [queue.array[0].element]
    let codes = getBinCodes(tree)

    return { count, tree, codes }
}

document.querySelector('#doit').addEventListener('click', e => {
    let input = document.querySelector('#input-string').value;
    let stripped = stripSymbols(input)
    if (stripped === '')
        document.querySelector('#result').innerHTML = 'Input can\'t be empty!'
    else {
        let { count, tree, codes } = buildTree(stripped)
        let output = ''

        while (true) {
            output += '<div class="row">'
            let newtree = []

            let splitcount = 0
            for (let element of tree) {
                if (Array.isArray(element)) {
                    output += '<div class="block split">^</div>'
                    newtree.push(...element)
                    splitcount++
                } else if (element === '') {
                    output += '<div class="block placeholder"></div>'
                    newtree.push('', '')
                } else {
                    output += '<div class="block">'
                    output += `<div class="letter">${element}</div>`
                    output += `<div class="count">${count[element]}</div>`
                    output += '</div>'
                    newtree.push('', '')
                }
            }
            tree = newtree
            output += '</div>'
            if (splitcount === 0) break
        }

        output += '<br><br>';

        for (let letter in codes) {
            output += `<div>${letter}: ${codes[letter]}</div>`
        }

        output += '<br><br>';

        output += `Encoded string: ${encode(stripped, codes)}`

        document.querySelector('#result').innerHTML = output
    }
})

document.querySelector('#input-string').value = decodeURIComponent(location.hash.slice(1))
