/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;

// Prefijo del identificador: "I-" da I-1, I-2, I-3...
var PREFIX = 'I-';

var ICON = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'icon.svg';

// Cola para evitar que varias tarjetas lean el mismo contador a la vez
var queue = Promise.resolve();

function assignNumber(t) {
  var job = queue.then(function () {
    return t.get('card', 'shared', 'seq').then(function (seq) {
      if (seq) return seq;
      return t.get('board', 'shared', 'counter', 0).then(function (counter) {
        var next = (counter || 0) + 1;
        return t
          .set('board', 'shared', 'counter', next)
          .then(function () { return t.set('card', 'shared', 'seq', next); })
          .then(function () { return next; });
      });
    });
  });
  queue = job.catch(function () {});
  return job;
}

// Renumera todas las tarjetas abiertas siguiendo el orden de listas y posiciones
function renumberAll(t) {
  return t.lists('id', 'name', 'cards').then(function (lists) {
    var n = 0;
    var chain = Promise.resolve();
    lists.forEach(function (list) {
      list.cards.forEach(function (card) {
        n += 1;
        var value = n;
        chain = chain.then(function () {
          return t.set(card.id, 'shared', 'seq', value);
        });
      });
    });
    return chain.then(function () {
      return t.set('board', 'shared', 'counter', n);
    });
  });
}

TrelloPowerUp.initialize({
  'card-badges': function (t) {
    return assignNumber(t).then(function (n) {
      return [{ text: PREFIX + n }];
    });
  },

  'card-detail-badges': function (t) {
    return assignNumber(t).then(function (n) {
      return [{ title: 'Número', text: PREFIX + n }];
    });
  },

  'board-buttons': function () {
    return [
      {
        icon: { dark: ICON, light: ICON },
        text: 'Renumerar tarjetas',
        callback: function (t) {
          return renumberAll(t).then(function () {
            return t.alert({ message: 'Tarjetas renumeradas', duration: 4 });
          });
        }
      }
    ];
  }
});
