<?php
/*
 * This file is part of the Sulu CMS.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\Webspace;

/**
 * Represents the segments defined in a webspace
 * @package Sulu\Component\Portal
 */
class Segment
{
    /**
     * The key of the segment
     * @var string
     */
    private $key;

    /**
     * The name of the segment
     * @var string
     */
    private $name;

    /**
     * Defines if this segment is the default one
     * @var boolean
     */
    private $default;

    /**
     * Sets the key of the segment
     * @param string $key
     */
    public function setKey($key)
    {
        $this->key = $key;
    }

    /**
     * Returns the key of the segment
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * Sets the name of the segment
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Returns the name of the segment
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets if this segment is the default one
     * @param boolean $default
     */
    public function setDefault($default)
    {
        $this->default = $default;
    }

    /**
     * Returns whether this segment is the default one
     * @return boolean
     */
    public function isDefault()
    {
        return $this->default;
    }
}
