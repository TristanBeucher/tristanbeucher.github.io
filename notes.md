---
layout: default
title: notes
---

{% assign notes = site.notes | sort: 'date' | reverse %}
<ul>
  {% for note in notes %}
    <li>
      <a href="{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>