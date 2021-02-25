class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class SLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  push(val) {
    let newNode = new Node(val)
    if (this.head === null) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }
  pop() {
    if (this.head == null) return null
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.length--
    }
    else {
      let current = this.head
      let newTail = current
      while (current.next !== null) {
        newTail = current
        current = current.next
      }
      this.tail = newTail
      this.tail.next = null;
      this.length--;
      return current;
    }
  }
  shift() {
    if (this.head == null) return undefined;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.length--;
    } else {
      let oldHead = this.head
      this.head = oldHead.next;
      this.length--;
      return oldHead

    }
  }
  unshift(val) {
    let newNode = new Node(val)
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++
    return this
  }
  get(index) {
    if (index < 0 || index >= this.length) return null
    let counter = 0
    let current = this.head
    while (counter !== index) {
      counter++
      current = current.next
    }
    return current
  }
  set(index, val) {
    let foundNode = this.get(index)
    if (foundNode) {
      foundNode.val = val
      return true
    }
    return false

  }
  insert(index, val) {
    if (index < 0 || index > this.length) return false
    if (index === 1) return !!this.unshift(val)
    if (index === this.length) return !!this.push(val)
    let newNode = new Node(val)
    let counter = 0;
    let current = this.head
    let temp = current;
    while (counter !== index) {
      temp = current;
      current = current.next;
      counter++;
    }
    newNode.next = current;
    temp.next = newNode;
    this.length++;
    return true

  }

  remove(index) {
    if (index < 0 || index > this.length) return undefined;
    if (index === 0) return !!this.shift()
    if (index === this.length - 1) return !!this.pop()
    let current = this.head;
    let temp = current;
    let counter = 0
    while (counter !== index) {
      temp = current;
      current = current.next
      counter++
    }
    temp.next = current.next
    this.length--;
    return true;

  }
  all() {
    let res = []
    let current = this.head
    while (current) {
      res.push(current.val)
      current = current.next
    }
    return res
  }
  reverse() {
    let node = this.head
    this.head = this.tail
    this.tail = node
    let next
    let prev = null
    while (node) {
      next = node.next
      node.next = prev
      prev = node;
      node = next
    }
    return this
  }
  move(num) {
    if (num > this.length - 1) {
      num = this.length - 1
    }
    let oldHead = this.head.val

    this.insert(num + 1, oldHead)
    return !!this.shift()


  }

}

 
module.exports = SLL