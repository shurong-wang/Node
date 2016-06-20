var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
    fristName: String,
    lastName: String
});

// 虚拟属性的设置 Schema.virtual().get(func)
PersonSchema.virtual('fullName').get(function () {
    return this.fristName + ' ' + this.lastName;
});
// 设置：将模型的实例转换为 json 时，包含虚拟属性（默认不包含）
PersonSchema.set('toJSON', {getters: true, virtual: true});

var Person = mongoose.model('Person', PersonSchema);

var person = new Person({
    fristName: 'Ryan',
    lastName: 'Dahl'
});

console.log('\nFullName:', person.fullName);

// 将模型的实例转换为 json 时，默认不包含虚拟属性
console.log('\nJSON:', JSON.stringify(person));