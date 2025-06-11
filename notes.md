---
layout: blog
title: Notes
permalink: /notes/
---

Here are my notes — shorter posts and quick thoughts.

{% assign notes = site.notes | sort: 'date' | reverse %}
<ul>
  {% for note in notes %}
    <li>
      <a href="{{ note.url }}">{{ note.title }}</a> — {{ note.date | date: "%Y-%m-%d" }}
    </li>
  {% endfor %}
</ul>
